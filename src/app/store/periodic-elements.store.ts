import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject, Signal } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap, catchError, of } from 'rxjs';
import { PeriodicElement } from '../models/periodic-element.model';
import { PeriodicElementsService } from '../services/periodic-elements.service';
import { PeriodicElementsState } from '../models/periodic-elements-state.module';


const initialState: PeriodicElementsState = {
  elements: [],
  filteredElements: [],
  searchTerm: '',
  isLoading: false,
  error: null,
};

export const PeriodicElementsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    elementsCount: computed(() => store.elements().length),
    filteredElementsCount: computed(() => store.filteredElements().length),
    hasElements: computed(() => store.elements().length > 0),
    isSearching: computed(() => store.searchTerm().trim().length > 0),
    hasSearchResults: computed(() => {
      const searchTerm = store.searchTerm().trim();
      return searchTerm.length > 0 ? store.filteredElements().length > 0 : true;
    }),
  })),

  withMethods((store) => {
    const periodicElementsService = inject(PeriodicElementsService);

    return {
      loadElements: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            periodicElementsService.getElements().pipe(
              tap((elements: PeriodicElement[]) => {
                patchState(store, {
                  elements,
                  filteredElements: elements,
                  isLoading: false,
                  error: null,
                });
              }),
              catchError((error: any) => {
                console.error('Error loading elements:', error);
                patchState(store, {
                  isLoading: false,
                  error: typeof error === 'string' ? error : 'Failed to load elements',
                });
                return of();
              })
            )
          )
        )
      ),

      searchElements: rxMethod<string>(
        pipe(
          debounceTime(2000),
          distinctUntilChanged(),
          tap((searchTerm) => {
            patchState(store, { searchTerm });
            const filteredElements = filterElements(store.elements(), searchTerm);
            patchState(store, { filteredElements });
          })
        )
      ),

      setSearchTerm: (searchTerm: string) => {
        patchState(store, { searchTerm });
        const filteredElements = filterElements(store.elements(), searchTerm);
        patchState(store, { filteredElements });
      },

      clearSearch: () => {
        patchState(store, {
          searchTerm: '',
          filteredElements: store.elements(),
        });
      },

      updateElement: (updatedElement: PeriodicElement) => {
        const elements = store.elements().map((element) =>
          element.position === updatedElement.position ? updatedElement : element
        );
        patchState(store, { elements });

        const filteredElements = filterElements(elements, store.searchTerm());
        patchState(store, { filteredElements });
      },

      addElement: (newElement: PeriodicElement) => {
        const elements = [...store.elements(), newElement];
        patchState(store, { elements });

        const filteredElements = filterElements(elements, store.searchTerm());
        patchState(store, { filteredElements });
      },

      removeElement: (position: number) => {
        const elements = store.elements().filter((element) => element.position !== position);
        patchState(store, { elements });

        const filteredElements = filterElements(elements, store.searchTerm());
        patchState(store, { filteredElements });
      },

      clearError: () => {
        patchState(store, { error: null });
      },

      reset: () => {
        patchState(store, {
          elements: [],
          filteredElements: [],
          searchTerm: '',
          isLoading: false,
          error: null,
        });
      },
    };
  })
);

function filterElements(elements: PeriodicElement[], searchTerm: string): PeriodicElement[] {
  if (!searchTerm.trim()) {
    return elements;
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  return elements.filter((element) => {
    return (
      element.name.toLowerCase().includes(lowerSearchTerm) ||
      element.symbol.toLowerCase().includes(lowerSearchTerm) ||
      element.position.toString().includes(lowerSearchTerm) ||
      element.weight.toString().includes(lowerSearchTerm)
    );
  });
}