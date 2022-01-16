import { EMPTY, isObservable, Observable, Subject } from 'rxjs';

/** Subscribes a Subject to an Observable, omitting the complete-handler. */
export function subscribeSubject<T, C extends Subject<T>>(
  subject: C,
  source: Observable<T> | T = EMPTY
): void {
  if (isObservable(source)) {
    source.subscribe({
      next(value) {
        subject.next(value);
      },
      error(value: unknown) {
        subject.error(value);
      },
    });
  } else {
    subject.next(source);
  }
}
