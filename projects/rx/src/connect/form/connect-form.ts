import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { connect } from '../connect';
import { Connectable } from '../connect-model';

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
