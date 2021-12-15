import {
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { CanConnect } from '@berglund/rx';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Constructor } from '../mixin/constructor';
import { Mixin } from '../mixin/mixin-base';

interface FormControlParentMixin extends ControlValueAccessor, CanConnect {
  _formControl: FormControl;
  _errors$: Observable<ValidationErrors | null>;
}

export type FormControlValueAccessorConstructor =
  Constructor<FormControlParentMixin>;

/**
 * A utility mixin that uses a `FormControl` to implement:
 *   - `ControlValueAccessor`
 *   - `CanConnect`
 */
export function mixinFormControlParent<T extends Constructor<Mixin> = any>(
  base: T
): FormControlValueAccessorConstructor & T {
  return class extends base {
    private _disabledSub = new BehaviorSubject<boolean>(false);
    _disabled$ = this._disabledSub.value;
    get _disabled() {
      return this._disabledSub.value;
    }

    _formControl = new FormControl();
    _errors$ = this._formControl.statusChanges.pipe(
      map(() => this._formControl.errors)
    );

    _touched: boolean;

    constructor(...args: any[]) {
      super(...args);
    }

    registerOnTouched(): void {
      this._touched = true;
    }

    registerOnChange(fn: (value: any) => void) {
      this.getChanges().pipe(takeUntil(this.destroyed$)).subscribe(fn);
    }

    getChanges() {
      return this._formControl.valueChanges;
    }

    update(value: any, emitValue?: boolean) {
      this._formControl.setValue(value, { emitEvent: emitValue });
    }

    writeValue(value: any) {
      this._formControl.setValue(value, { emitEvent: false });
    }

    setErrors(errors: ValidationErrors | null): void {
      this._formControl.setErrors(errors);
    }

    setDisabled(disabled: boolean): void {
      this._disabledSub.next(disabled);
      if (disabled) {
        this._formControl.disable({ emitEvent: false });
      } else {
        this._formControl.enable({ emitEvent: false });
      }
    }
  };
}
