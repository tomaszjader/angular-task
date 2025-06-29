import { PeriodicElement } from './periodic-element.model';

export interface DialogData {
  element: PeriodicElement;
  field: keyof PeriodicElement;
  fieldName: string;
}