import { Observable } from 'rxjs';
import { Constructor, Mixin, MixinApi } from '../core';
import { Interactive } from './interactive-model';

export type InteractiveConstructor = Constructor<MixinApi<Interactive>>;

/**
 * An interactive component listens to user events.
 */
export function mixinInteractive<T extends Constructor<Mixin<Interactive>>>(
  base: T
): InteractiveConstructor & T {
  return class extends base {
    disabled: boolean | Observable<boolean>;
    _disabled: boolean;
    _disabled$ = this.defineAccessors('disabled', false);

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
