import { Observable } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

/** Unflattens observables to call an API lazily, using `withLatestFrom` and a trigger observable. */
export function triggeredUnflatten<T, O1>(
  trigger: Observable<any>,
  api: (a: O1) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<O1>
): Observable<T>;
export function triggeredUnflatten<T, O1, O2>(
  trigger: Observable<any>,
  api: (a: O1, b: O2) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<O1>,
  b: Observable<O2>
): Observable<T>;
export function triggeredUnflatten<T, O1, O2, O3>(
  trigger: Observable<any>,
  api: (a: O1, b: O2, c: O3) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<O1>,
  b: Observable<O2>,
  c: Observable<O3>
): Observable<T>;
export function triggeredUnflatten<T, O1, O2, O3, O4>(
  trigger: Observable<any>,
  api: (a: O1, b: O2, c: O3, d: O4) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<O1>,
  b: Observable<O2>,
  c: Observable<O3>,
  d: Observable<O4>
): Observable<T>;
export function triggeredUnflatten<T, O1, O2, O3, O4, O5>(
  trigger: Observable<any>,
  api: (a: O1, b: O2, c: O3, d: O4, e: O5) => Observable<T>,
  unflattener: typeof switchMap,
  a: Observable<O1>,
  b: Observable<O2>,
  c: Observable<O3>,
  d: Observable<O4>,
  e: Observable<O5>
): Observable<T>;
export function triggeredUnflatten<T>(
  trigger: Observable<any>,
  api: (...args: Observable<any>[]) => Observable<T>,
  unflattener = switchMap,
  ...args: Observable<any>[]
): Observable<T> {
  return trigger.pipe(
    withLatestFrom(...args),
    filter(Array.isArray),
    map((values) => values.filter((_, index) => index !== 0)),
    unflattener((args) => api(...args))
  );
}
