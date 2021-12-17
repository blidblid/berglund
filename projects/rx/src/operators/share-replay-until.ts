import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

/** A memory safe version of `shareReplay` that adds an upstream `takeUntil`. */
export function shareReplayUntil<T>(
  takeUntil$: Observable<void>,
  shareReplayOperator: MonoTypeOperatorFunction<T> = shareReplay({
    bufferSize: 1,
    refCount: true,
  })
): MonoTypeOperatorFunction<T> {
  return (source$): Observable<T> => {
    return source$.pipe(shareReplayOperator, takeUntil(takeUntil$));
  };
}
