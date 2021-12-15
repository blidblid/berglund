import { ValidatorFn } from '@angular/forms';
import { EMPTY, isObservable, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Connectable } from '.';
import { ValidatedSubject } from '../subjects/validatable-subject';
import { CanConnect } from './can-connect';

export class UserInputSubject<T> extends ValidatedSubject<T> {}
export class UserTriggerSubject<T> extends Subject<T> {}

export function userInput<T>(
  value: Observable<T> | T = EMPTY,
  options?: UserInputOptions | ValidatorFn[]
): ValidatedSubject<T> {
  let validators: ValidatorFn[] = [];
  let emitInvalid = false;

  if (Array.isArray(options)) {
    validators = options;
  } else {
    validators = options?.validators ?? [];
    emitInvalid = !!options?.emitInvalid;
  }

  return subscribeSubject(
    new UserInputSubject<T>(validators, emitInvalid),
    value
  );
}

export function userTrigger<T>(source: Observable<T> | T = EMPTY): Subject<T> {
  return subscribeSubject(new UserTriggerSubject<T>(), source);
}

/** Connects a CanConnect class with a Connectable. */
export function connectConnectable<T>(
  connectable: Connectable<T>,
  canConnect: CanConnect<T> = {},
  destroyed$: Observable<any> = EMPTY
): void {
  let isUserInput = false;

  if (!isObservable(connectable)) {
    if (canConnect.update) {
      canConnect.update(connectable);
    }

    return;
  }

  if (canConnect.update) {
    connectable
      .pipe(
        filter(() => !isUserInput),
        takeUntil(destroyed$)
      )
      .subscribe((value) => {
        if (canConnect.update) {
          canConnect.update(value);
        }
      });
  }

  if (
    !(connectable instanceof UserInputSubject) &&
    !(connectable instanceof UserTriggerSubject)
  ) {
    return;
  }

  if (canConnect.getChanges) {
    canConnect
      .getChanges()
      .pipe(takeUntil(destroyed$))
      .subscribe((data) => {
        isUserInput = true;
        connectable.next(data);
        isUserInput = false;
      });
  }

  if (canConnect.setErrors && isValidatedSubject(connectable)) {
    connectable
      .getErrors()
      .pipe(takeUntil(destroyed$))
      .subscribe((errors) => {
        if (canConnect.setErrors) {
          canConnect.setErrors(errors);
        }
      });
  }
}

/** Subscribes a Subject to an Observable, omitting the complete-handler. */
export function subscribeSubject<T, C extends Subject<T>>(
  subject: C,
  source: Observable<T> | T = EMPTY
): C {
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

  return subject;
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

export interface UserInputOptions {
  validators?: ValidatorFn[];

  /** Whether to emit values despite failing validation. */
  emitInvalid?: boolean;
}
