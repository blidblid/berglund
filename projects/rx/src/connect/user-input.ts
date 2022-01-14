import { ValidatorFn } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { ValidatedSubject } from '../subjects';
import { subscribeSubject } from '../subjects/subject-util';

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

  const subject = new UserInputSubject<T>(validators, emitInvalid);
  subscribeSubject(subject, value);

  return subject;
}

export function userTrigger<T = any>(): Subject<T> {
  return new UserTriggerSubject<T>();
}

export interface UserInputOptions {
  validators?: ValidatorFn[];

  /** Whether to emit values despite failing validation. */
  emitInvalid?: boolean;
}
