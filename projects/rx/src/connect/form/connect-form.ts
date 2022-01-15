import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { Connectable } from '../connect-model';
import { connect } from '../connect-util';

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
