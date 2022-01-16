import { Directive, Host, Input, Optional } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { Connectable, connectFormValue } from '../../connect';

/** Connects a FormControl to a Subject. */
@Directive({
  selector: '[connectFormControlValue]',
})
export class BergConnectFormControlValueDirective<T = any> {
  /** Connectable to connect with FormControl. */
  @Input('connectForm')
  set connectable(connectable: Connectable<T>) {
    connectFormValue(connectable, this.formControl, this.destroySub);
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

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
