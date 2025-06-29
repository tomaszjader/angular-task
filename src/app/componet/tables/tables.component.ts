import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PeriodicElement } from '../../models/periodic-element.model';
import { PeriodicElementsService } from '../../services/periodic-elements.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  elements: PeriodicElement[] = [];
  isLoading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private periodicElementsService: PeriodicElementsService) {}
  ngOnInit(): void {
    this.loadElements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadElements(): void {
    this.isLoading = true;
    this.error = null;

    this.periodicElementsService.getElements()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.elements = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error;
          this.isLoading = false;
          console.error('Błąd podczas pobierania danych:', error);
        }
      });
  }

  retry(): void {
    this.loadElements();
  }
}
