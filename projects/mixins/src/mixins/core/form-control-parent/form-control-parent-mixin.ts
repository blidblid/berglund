import { FormControl, ValidationErrors } from '@angular/forms';
import { Connectable, connectForm } from '@berglund/rx';
import {
  asapScheduler,
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
} from 'rxjs';
import { delay, map, switchMap, takeUntil } from 'rxjs/operators';
import { Constructor } from '../mixin/constructor';
import { Mixin, MixinApi } from '../mixin/mixin-base';
import { Form } from './form-control-parent-model';

interface FormMixin<T> extends MixinApi<Form<T>> {
  _errors$: Observable<ValidationErrors | null>;
}

export type FormConstructor<T> = Constructor<FormMixin<T>>;

/**
 * A form uses FormControl.
 */
export function mixinForm<T extends Constructor<Mixin<Form<V>>> = any, V = any>(
  base: T
): FormConstructor<V> & T {
  return class extends base {
    connectToForm: Connectable<V> | Observable<Connectable<V>>;
    _connectToForm: Connectable<V>;
    _connectToForm$ = this.defineAccessors('connectToForm', null);

    formControl: FormControl | Observable<FormControl>;
    _formControl: FormControl;
    _formControl$ = this.defineAccessors('formControl');

    private _disabledSub = new BehaviorSubject<boolean>(false);
    _disabled$ = this._disabledSub.value;
    get _disabled() {
      return this._disabledSub.value;
    }

    _errors$ = this._formControl$.pipe(
      switchMap((formControl) =>
        formControl ? formControl.statusChanges : EMPTY
      ),
      map(() => (this._formControl ? this._formControl.errors : {}))
    );

    _touched: boolean;

    constructor(...args: any[]) {
      super(...args);

      combineLatest([this._formControl$, this._connectToForm$])
        // delay to let mixin finish mixing
        .pipe(delay(0, asapScheduler), takeUntil(this.destroyed$))
        .subscribe(([formControl, connectToForm]) => {
          if (formControl) {
            connectForm(connectToForm, formControl, this.destroyed$);
          }
        });
    }

    setErrors(errors: ValidationErrors | null): void {
      this._formControl?.setErrors(errors);
    }
  };
}
