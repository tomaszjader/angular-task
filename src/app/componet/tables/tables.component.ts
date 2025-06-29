import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElement } from '../../models/periodic-element.model';
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
import { PeriodicElementsStore } from '../../store/periodic-elements.store';


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
  
  readonly store = inject(PeriodicElementsStore);
  
  readonly elements = this.store.elements;
  readonly filteredElements = this.store.filteredElements;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly searchTerm = this.store.searchTerm;
  readonly elementsCount = this.store.elementsCount;
  readonly filteredElementsCount = this.store.filteredElementsCount;
  readonly hasElements = this.store.hasElements;
  readonly isSearching = this.store.isSearching;
  readonly hasSearchResults = this.store.hasSearchResults;
  
  searchControl = new FormControl('');
  
  private destroy$ = new Subject<void>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadElements();
    this.setupSearchFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadElements(): void {
    this.store.loadElements();
  }

  retry(): void {
    this.store.clearError();
    this.loadElements();
  }

  setupSearchFilter(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchTerm => {
        this.store.searchElements(searchTerm || '');
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.store.clearSearch();
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
          this.store.updateElement(updatedElement);
        }
      });
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

  addNewElement(element: PeriodicElement): void {
    this.store.addElement(element);
  }

  removeElement(position: number): void {
    this.store.removeElement(position);
  }

  resetTable(): void {
    this.searchControl.setValue('');
    this.store.reset();
    this.loadElements();
  }
}