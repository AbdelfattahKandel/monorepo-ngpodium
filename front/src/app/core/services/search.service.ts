import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');
  readonly debouncedQuery = signal('');

  private debounceTimer: any;

  constructor() {
    effect(() => {
      const q = this.query();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.debouncedQuery.set(q), 150);
    });
  }

  set(term: string) {
    this.query.set(term ?? '');
  }

  clear() {
    this.query.set('');
  }
}
