import { isObservable, Observable, of, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/** Unflattens an observable if it is an observable. */
export function safeUnflatten<T>(
  unflattener = switchMap
): OperatorFunction<T | Observable<T>, T> {
  return (source: Observable<T | Observable<T>>) => {
    return source.pipe(
      unflattener((value) => (isObservable(value) ? value : of(value)))
    );
  };
}
