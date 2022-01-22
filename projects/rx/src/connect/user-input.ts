import { ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { subscribeSubject } from '../subjects/subject-util';

export class UserErrorSubject<T> extends BehaviorSubject<T> {}
export class UserValueSubject<T> extends ReplaySubject<T> {}
export class UserTriggerSubject<T> extends Subject<T> {}

export function userValue<T>(
  value: Observable<T> | T = EMPTY
): UserValueSubject<T> {
  const subject = new UserValueSubject<T>(1);
  subscribeSubject(subject, value);

  return subject;
}

export function userTrigger<T = any>(): UserTriggerSubject<T> {
  return new UserTriggerSubject<T>();
}

export function userError(): UserValueSubject<ValidationErrors | null> {
  return userValue<ValidationErrors | null>();
}

export interface UserInputOptions {
  validators?: ValidatorFn[];

  /** Whether to emit values despite failing validation. */
  emitInvalid?: boolean;
}
