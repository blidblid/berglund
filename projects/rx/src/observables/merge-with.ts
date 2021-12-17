import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/** Merges any number of observable emissions using a merger-function. */
export function mergeWith<T>(
  merger: (...values: T[]) => T,
  ...observables: Observable<T>[]
): Observable<T> {
  return combineLatest(
    observables.map((observable) => observable.pipe(startWith(null)))
  ).pipe(
    map((emissions) => {
      return merger(
        ...emissions.filter((emission): emission is T => emission !== null)
      );
    })
  );
}
