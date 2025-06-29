import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElement } from '../../models/periodic-element.model';
import { PeriodicElementsService } from '../../services/periodic-elements.service';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogData } from '../../models/dialog-data.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    EditElementDialogComponent
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'name', 'symbol', 'weight'];
  elements: PeriodicElement[] = [];
  filteredElements: PeriodicElement[] = [];
  isLoading = false;
  error: string | null = null;
  
  searchControl = new FormControl('');
  
  private destroy$ = new Subject<void>();

  constructor(
    private periodicElementsService: PeriodicElementsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadElements();
    this.setupSearchFilter();
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
          this.filteredElements = [...data];
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error;
          this.isLoading = false;
          console.error('Error loading data:', error);
        }
      });
  }

  retry(): void {
    this.loadElements();
  }

  setupSearchFilter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(2000), 
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filterElements(searchTerm || '');
      });
  }

  filterElements(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredElements = [...this.elements];
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    this.filteredElements = this.elements.filter(element => {
      return (
        element.name.toLowerCase().includes(lowerSearchTerm) ||
        element.symbol.toLowerCase().includes(lowerSearchTerm) ||
        element.position.toString().includes(lowerSearchTerm) ||
        element.weight.toString().includes(lowerSearchTerm)
      );
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.filteredElements = [...this.elements];
  }

  editElement(element: PeriodicElement, field: keyof PeriodicElement): void {
    const fieldNames: Record<keyof PeriodicElement, string> = {
      position: 'Atomic Number',
      name: 'Name',
      symbol: 'Symbol',
      weight: 'Atomic Weight'
    };

    const dialogData: DialogData = {
      element: element,
      field: field,
      fieldName: fieldNames[field]
    };

    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedElement: PeriodicElement) => {
        if (updatedElement) {
          this.updateElementInTable(updatedElement);
        }
      });
  }

  private updateElementInTable(updatedElement: PeriodicElement): void {
    const index = this.elements.findIndex(el => el.position === updatedElement.position);
    if (index !== -1) {
      this.elements[index] = updatedElement;
      this.elements = [...this.elements];
      this.filterElements(this.searchControl.value || '');
    }
  }

  getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      position: 'Atomic Number',
      name: 'Name',
      symbol: 'Symbol',
      weight: 'Atomic Weight'
    };
    return fieldNames[field] || field;
  }
}