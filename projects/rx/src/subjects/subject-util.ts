import { EMPTY, isObservable, Observable, Subject } from 'rxjs';
import { ValidatedSubject } from './validatable-subject';

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

export function isValidatedSubject<T>(
  subject: any
): subject is ValidatedSubject<T> {
  return typeof subject.getErrors === 'function' && isSubject(subject);
}

export function isSubject<T>(value: any): value is Subject<T> & Observable<T> {
  return (
    typeof value === 'object' &&
    'next' in value &&
    'complete' in value &&
    'error' in value &&
    isObservable(value)
  );
}
