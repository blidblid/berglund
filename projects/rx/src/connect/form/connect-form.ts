import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Connectable } from '../connect-model';
import { connect } from '../connect-util';

/** Connects the value of a FormControl with a Connectable. */
export function connectFormValue<T>(
  connectable: Connectable<T>,
  form: FormControl | FormGroup,
  destroyed$: Observable<any> = EMPTY
): void {
  connect(connectable, form.valueChanges, destroyed$, (value) => {
    form.setValue(value, { emitEvent: false });
  });
}

/** Connects the errors of a FormControl with a Connectable. */
export function connectFormError<T>(
  connectable: Connectable<T>,
  form: FormControl | FormGroup,
  destroyed$: Observable<any> = EMPTY
): void {
  connect(
    connectable,
    form.statusChanges.pipe(map(() => form.errors)),
    destroyed$,
    (value) => form.setErrors(value, { emitEvent: false })
  );
}
