import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

/** Wait for another Observable to emit. */
export function waitFor<T>(
  waitFor$: Observable<any>
): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      switchMap((value) =>
        waitFor$.pipe(
          take(1),
          map(() => value)
        )
      )
    );
}
