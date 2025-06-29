import { Injectable } from '@angular/core';
import { PeriodicElement } from '../models/periodic-element.model';
import {PERIODIC_ELEMENTS} from "../data/periodic-elements.data";
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementsService {
  private readonly elements: PeriodicElement[] = PERIODIC_ELEMENTS;

   getElements(): Observable<PeriodicElement[]> {
    return of(this.elements).pipe(
      delay(300)
    );
  }

  getElementById(id: number): PeriodicElement | undefined {
    return this.elements.find(element => element.position === id);
  }
}