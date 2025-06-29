# Zadanie rekrutacyjne — Tabela pierwiastków

## Opis projektu

Stwórz prostą aplikację wyświetlającą tabelę pierwiastków chemicznych z kolumnami:

- Number (pozycja)
- Name (nazwa)
- Weight (masa)
- Symbol (symbol)

## Wymagania funkcjonalne

1. **Pobieranie danych:**  
   Dane do tabeli powinny być zasymulowane i załadowane automatycznie przy starcie aplikacji (np. za pomocą opóźnienia imitującego zapytanie do API).

2. **Edycja rekordu:**  
   Umożliw edycję dowolnej wartości w wybranym wierszu tabeli poprzez popup z inputem.  
   Po zatwierdzeniu zmiany, tabela powinna się natychmiast zaktualizować.

3. **Filtrowanie:**  
   Dodaj jedno pole tekstowe, które pozwala filtrować wiersze tabeli na podstawie wpisanej frazy.  
   Filtrowanie powinno działać na wszystkich kolumnach jednocześnie i uruchamiać się 2 sekundy po ostatnim wpisaniu znaku (debounce).

## Dane początkowe

```typescript
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
