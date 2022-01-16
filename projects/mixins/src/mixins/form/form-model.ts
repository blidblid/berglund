import { FormControl, ValidationErrors } from '@angular/forms';
import { Connectable } from '@berglund/rx';

export interface Form<T> {
  connectToFormValue: Connectable<T>;
  connectToFormError: Connectable<ValidationErrors | null>;
  formControl: FormControl;
}
