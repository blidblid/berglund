import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/** Adds Validation to a ReplaySubject. If validation fails, `next` is never called. */
export class ValidatedSubject<T> extends ReplaySubject<T> {
  private formControl = new FormControl(null, this.validators);

  constructor(public validators: ValidatorFn[]) {
    super(1);
    this.next = this.nextWithValidation;
  }

  getErrors(): Observable<ValidationErrors | null> {
    return this.formControl
      ? this.formControl.statusChanges.pipe(
          startWith(null),
          map(() => this.formControl!.errors)
        )
      : of(null);
  }

  // This hack is only necessary in rxjs 6.
  // In rxjs 7, it is easy to properly override next.
  nextWithValidation(value: T): void {
    if (this.formControl) {
      this.formControl.setValue(value);
    }

    if (this.formControl?.errors === null) {
      super['nextInfiniteTimeWindow'](value);
    }
  }
}
