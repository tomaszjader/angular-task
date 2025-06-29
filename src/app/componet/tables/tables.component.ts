import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PeriodicElement } from '../../models/periodic-element.model';
import { PeriodicElementsService } from '../../services/periodic-elements.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  displayedColumns: string[] = ['position', 'name', 'symbol', 'weight'];
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
