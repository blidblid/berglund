import { Observable } from 'rxjs';
import { Constructor, Mixin, MixinApi } from '../core';
import { Stateful } from './stateful-model';

export type StatefulConstructor = Constructor<MixinApi<Stateful>>;

/**
 * Stateful components have state and edit it.
 */
export function mixinStateful<T extends Constructor<Mixin<Stateful>>>(
  base: T
): StatefulConstructor & T {
  return class extends base {
    required: boolean | Observable<boolean>;
    _required: boolean;
    _required$ = this.defineAccessors('required', false);

    readonly: boolean | Observable<boolean>;
    _readonly: boolean;
    _readonly$ = this.defineAccessors('readonly', false);

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
