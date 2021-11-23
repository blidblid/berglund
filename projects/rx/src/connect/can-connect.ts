import { ValidationErrors } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

/** Can connect to a `Connectable`. */
export interface CanConnect<T = any> {
  /** Changes by the Connectable that should call next on a connected Subject. */
  getChanges?(): Observable<T>;

  /** Handler for when a connected Subject receives a new value. */
  update?(value: T | null, emitValue?: boolean): void;

  /** Handler for when a connected Subject does not validate. */
  setErrors?(errors: ValidationErrors | null): void;
}

export type Connectable<T = any> = Subject<T> | Observable<T> | T | null;
