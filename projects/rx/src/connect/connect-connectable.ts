import { EMPTY, filter, isObservable, Observable, takeUntil } from 'rxjs';
import { isValidatedSubject } from '../subjects';
import { CanConnect, Connectable } from './can-connect';
import { UserInputSubject, UserTriggerSubject } from './user-input';

/** Connects a CanConnect class with a Connectable. */
export function connectCanConnect<T>(
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
