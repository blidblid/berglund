import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

/** Holds on to a value until another Observable has emitted. */
export function waitFor<T>(
  waitFor$: Observable<any>
): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      switchMap((value) => {
        return waitFor$.pipe(
          take(1),
          map(() => value)
        );
      })
    );
}
