import { PeriodicElement } from "../models/periodic-element.model";
export interface PeriodicElementsState {
  elements: PeriodicElement[];
  filteredElements: PeriodicElement[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}