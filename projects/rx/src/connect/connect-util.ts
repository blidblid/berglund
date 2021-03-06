import { filter, isObservable, Observable, takeUntil } from 'rxjs';
import { Connectable } from './connect-model';
import { UserTriggerSubject, UserValueSubject } from './user-input';

export function connect<T>(
  connectable: Connectable<T>,
  valueChanges: Observable<T>,
  destroyed$: Observable<any>,
  writeValue?: (value: T | null) => void
): void {
  let isUserInput = false;

  if (
    connectable instanceof UserValueSubject ||
    connectable instanceof UserTriggerSubject
  ) {
    valueChanges.pipe(takeUntil(destroyed$)).subscribe((value) => {
      isUserInput = true;
      connectable.next(value);
      isUserInput = false;
    });
  }

  if (!writeValue) {
    return;
  }

  if (!isObservable(connectable)) {
    writeValue(connectable);
    return;
  }

  connectable
    .pipe(
      filter(() => !isUserInput),
      takeUntil(destroyed$)
    )
    .subscribe((value) => writeValue(value));
}

export function getConnectableValue<T>(connectable: Connectable<T>): T | null {
  return isObservable(connectable) ? null : connectable ?? null;
}
