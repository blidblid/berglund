import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/** Adds Validation to a ReplaySubject. If validation fails, `next` is never called. */
export class ValidatedSubject<T> extends ReplaySubject<T> {
  private formControl = new FormControl(null, this.validators);

  constructor(public validators: ValidatorFn[], private emitInvalid?: boolean) {
    super(1);
  }

  getErrors(): Observable<ValidationErrors | null> {
    return this.formControl
      ? this.formControl.statusChanges.pipe(
          startWith(null),
          map(() => this.formControl.errors)
        )
      : of(null);
  }

  override next(value: T): void {
    this.formControl.setValue(value);

    if (this.emitInvalid || this.formControl.errors === null) {
      super.next(value);
    }
  }
}
