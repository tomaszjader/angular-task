import { Injectable } from '@angular/core';
import { PeriodicElement } from '../models/periodic-element.model';
import {PERIODIC_ELEMENTS} from "../data/periodic-elements.data";

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementsService {
  private readonly elements: PeriodicElement[] = PERIODIC_ELEMENTS;

  getElements(): PeriodicElement[] {
    return this.elements;
  }

  getElementById(id: number): PeriodicElement | undefined {
    return this.elements.find(element => element.position === id);
  }
}