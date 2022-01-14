import { FormControl } from '@angular/forms';
import { Connectable } from '@berglund/rx';

export interface Form<T> {
  connectToForm: Connectable<T>;
  formControl: FormControl;
}
