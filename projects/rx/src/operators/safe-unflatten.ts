import { isObservable, Observable, of, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function safeUnflatten<T>(
  unflattener = switchMap
): OperatorFunction<T | Observable<T>, T> {
  return (source: Observable<T | Observable<T>>) => {
    return source.pipe(
      unflattener((value) => (isObservable<T>(value) ? value : of(value)))
    );
  };
}
