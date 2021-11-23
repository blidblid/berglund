import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SessionCache<K = any, V = any> {
  private map = new Map<K, Observable<V>>();

  get(key: K, fallback: () => Observable<V>): Observable<V> {
    const mapValue = this.map.get(key);

    if (mapValue) {
      return mapValue;
    } else {
      const cached$ = fallback().pipe(shareReplay(1));
      this.map.set(key, cached$);
      return cached$;
    }
  }

  remove(key: K): void {
    this.map.delete(key);
  }
}
