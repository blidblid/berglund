import { Directive, Host, Input, Optional } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
} from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { CanConnect, Connectable, connectCanConnect } from '../../connect';

/** Connects a FormControl to a Subject. */
@Directive({
  selector: '[connectFormControlValue]',
})
export class BergConnectFormControlValueDirective<T = any>
  implements CanConnect
{
  /** Connectable to connect the FormControl. */
  @Input('connectFormControlValue')
  set connectable(connectable: Connectable<T>) {
    connectCanConnect(connectable, this, this.destroySub);
  }

  get formControl(): FormControl | FormGroup {
    return (
      this.formControlDirective?.form ??
      this.formGroupDirective?.form ??
      this.formControlName?.control
    );
  }

  private destroySub = new Subject<void>();

  constructor(
    @Optional() @Host() private formControlDirective: FormControlDirective,
    @Optional() @Host() private formGroupDirective: FormGroupDirective,
    @Optional() @Host() private formControlName: FormControlName
  ) {}

  update(value: T) {
    if (this.formControl) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  getChanges(): Observable<T> {
    if (!this.formControl) {
      return EMPTY;
    }

    return this.formControl.valueChanges;
  }

  setErrors(errors: ValidationErrors | null) {
    this.formControl.setErrors(errors);
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
