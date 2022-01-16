import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { isObservable } from 'rxjs';
import { connectFormValue } from '.';
import { Connectable } from '../connect-model';
import { getConnectableValue } from '../connect-util';

export class ConnectedFormControl extends FormControl {
  constructor(
    connectable?: Connectable,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(getConnectableValue(connectable), validatorOrOpts, asyncValidator);

    if (isObservable(connectable)) {
      connectFormValue(connectable, this);
    }
  }
}
