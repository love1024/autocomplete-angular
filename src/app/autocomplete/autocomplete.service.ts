import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private readonly http = inject(HttpClient);

  getSearchResults(query: string): Observable<unknown[]> {
    return this.http.get<{ data: unknown[] }>('/assets/data.json').pipe(
      delay(2000),
      map((res: { data: unknown[] }) => res.data),
      map((res) => res.filter((d: any) => d.address1.startsWith(query)))
    );
  }
}
