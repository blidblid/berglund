import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/** Unflattens observables to call an API eagerly, using `combineLatest`. */
export function eagerUnflatten<T, K1>(
  api: (a: K1) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<K1>
): Observable<T>;
export function eagerUnflatten<T, K1, K2>(
  api: (a: K1, b: K2) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<K1>,
  b: Observable<K2>
): Observable<T>;
export function eagerUnflatten<T, K1, K2, K3>(
  api: (a: K1, b: K2, c: K3) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<K1>,
  b: Observable<K2>,
  c: Observable<K3>
): Observable<T>;
export function eagerUnflatten<T, K1, K2, K3, K4>(
  api: (a: K1, b: K2, c: K3, d: K4) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<K1>,
  b: Observable<K2>,
  c: Observable<K3>,
  d: Observable<K4>
): Observable<T>;
export function eagerUnflatten<T, K1, K2, K3, K4, K5>(
  api: (a: K1, b: K2, c: K3, d: K4, e: K5) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<K1>,
  b: Observable<K2>,
  c: Observable<K3>,
  d: Observable<K4>,
  e: Observable<K5>
): Observable<T>;
export function eagerUnflatten<T>(
  api: (...args: Observable<any>[]) => Observable<T>,
  unflattener = switchMap,
  ...args: Observable<any>[]
): Observable<T> {
  return combineLatest(args).pipe(unflattener((args) => api(...args)));
}
