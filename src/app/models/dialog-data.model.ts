//import { PeriodicElement } from './periodic-element.model';

export interface PeriodicElement { 
  position: number;
  name: string;
  weight: number;
  symbol: string;
}
export interface DialogData {
  element: PeriodicElement;
  field: keyof PeriodicElement;
  fieldName: string;
}