import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY, filter, isObservable, Observable, takeUntil } from 'rxjs';
import { Connectable } from './can-connect';
import { UserInputSubject, UserTriggerSubject } from './user-input';

/** Connects a FormControl with a Connectable. */
export function connectForm<T>(
  connectable: Connectable<T>,
  form: FormControl | FormGroup,
  destroyed$: Observable<any> = EMPTY
): void {
  connect(connectable, form.valueChanges, destroyed$, (value) => {
    form.setValue(value, { emitEvent: false });
  });
}

export function connect<T>(
  connectable: Connectable<T>,
  valueChanges: Observable<T>,
  destroyed$: Observable<any>,
  writeValue?: (value: T | null) => void
): void {
  let isUserInput = false;

  if (
    connectable instanceof UserInputSubject ||
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
