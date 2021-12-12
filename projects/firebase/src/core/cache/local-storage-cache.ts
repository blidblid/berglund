import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { CacheStrategy } from './cache-model';
import { SessionCache } from './session-cache';

@Injectable({ providedIn: 'root' })
export class LocalStorageCache {
  constructor(private sessionCache: SessionCache) {}

  get<T>(
    key: string,
    fallbackApi: Observable<T>,
    cacheStrategy: CacheStrategy = 'persistent'
  ): Observable<T> {
    return this.sessionCache.get(
      key,
      cacheStrategy === 'persistent'
        ? () => this.getFromLocalStorage(key, fallbackApi)
        : () => fallbackApi
    );
  }

  remove(key: string): void {
    this.sessionCache.remove(key);
    localStorage.removeItem(key);
  }

  private getFromLocalStorage<T>(
    key: string,
    fallbackApi: Observable<T>
  ): Observable<T> {
    try {
      return this.readLocalStorage(key, fallbackApi);
    } catch {
      return fallbackApi;
    }
  }

  private readLocalStorage<T>(key: string, fallbackApi: Observable<T>) {
    const stringFromLocalStorage = localStorage.getItem(key);
    const fromLocalStorage = stringFromLocalStorage
      ? JSON.parse(stringFromLocalStorage)
      : null;

    if (fromLocalStorage) {
      return of(fromLocalStorage).pipe(shareReplay(1));
    } else {
      return fallbackApi.pipe(
        tap((response) => {
          if (response && (!Array.isArray(response) || response.length > 0)) {
            localStorage.setItem(key, JSON.stringify(response));
          }
        })
      );
    }
  }
}
