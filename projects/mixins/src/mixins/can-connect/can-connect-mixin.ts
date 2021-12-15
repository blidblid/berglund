import { ValidationErrors } from '@angular/forms';
import { CanConnect, Connectable, connectConnectable } from '@berglund/rx';
import { asapScheduler, Observable } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Constructor, Mixin, MixinApi } from '../core';

interface CanConnectInputs<V> {
  connect: Connectable<V>;
}

interface CanConnectMixin<V>
  extends CanConnect<V>,
    MixinApi<CanConnectInputs<V>> {}

export type CanConnectConstructor<V> = Constructor<CanConnectMixin<V>>;

/**
 * Can connect with an rxjs/subject.
 */
export function mixinCanConnect<
  T extends Constructor<Mixin<CanConnectInputs<V>>>,
  V = any
>(base: T): CanConnectConstructor<V> & T {
  return class extends base {
    connect: Connectable<V> | Observable<Connectable<V>>;
    _connect: Connectable<V>;
    _connect$ = this.defineAccessors('connect', null);

    constructor(...args: any[]) {
      super(...args);

      this._connect$
        // delay to let mixin finish mixing
        .pipe(delay(0, asapScheduler), takeUntil(this.destroyed$))
        .subscribe((subject) => {
          if (subject) {
            connectConnectable(subject, this, this.destroyed$);
          }
        });
    }

    update?(value: V | null): void;
    setErrors?(errors: ValidationErrors | null): void;
    getChanges?(): Observable<V>;
  };
}
