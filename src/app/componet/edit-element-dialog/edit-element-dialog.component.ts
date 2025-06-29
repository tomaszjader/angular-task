import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PeriodicElement } from '../../models/periodic-element.model';
import { DialogData } from '../../models/dialog-data.model';


@Component({
  selector: 'app-edit-element-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-element-dialog.component.html',
  styleUrl: './edit-element-dialog.component.scss'
})
export class EditElementDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.editForm = this.createForm();
  }

  private createForm(): FormGroup {
    const currentValue = this.data.element[this.data.field];
    const validators = this.getValidators();

    return this.fb.group({
      value: [currentValue, validators]
    });
  }

  private getValidators() {
    const validators = [Validators.required];
    
    switch (this.data.field) {
      case 'position':
      case 'weight':
        validators.push(Validators.min(0));
        validators.push(Validators.pattern(/^\d+(\.\d+)?$/));
        break;
      case 'name':
        validators.push(Validators.minLength(1));
        validators.push(Validators.maxLength(50));
        break;
      case 'symbol':
        validators.push(Validators.minLength(1));
        validators.push(Validators.maxLength(3));
        validators.push(Validators.pattern(/^[A-Za-z]+$/));
        break;
    }
    
    return validators;
  }

  getInputType(): string {
    return (this.data.field === 'position' || this.data.field === 'weight') ? 'number' : 'text';
  }

  onSave(): void {
    if (this.editForm.valid) {
      let value = this.editForm.get('value')?.value;
      
      if (this.data.field === 'position' || this.data.field === 'weight') {
        value = parseFloat(value);
      }
      
      const updatedElement: PeriodicElement = {
        ...this.data.element,
        [this.data.field]: value
      };
      
      this.dialogRef.close(updatedElement);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}