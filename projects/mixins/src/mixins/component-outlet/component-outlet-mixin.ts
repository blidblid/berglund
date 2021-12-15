import { Observable } from 'rxjs';
import { Constructor, Mixin, MixinApi } from '../core';
import {
  ComponentOutlet,
  GetProjectedComponent,
} from './component-outlet-model';

type ComponentOutletMixin<V> = MixinApi<ComponentOutlet<V>>

export type ComponentOutletConstructor<V> = Constructor<
  ComponentOutletMixin<V>
>;

/**
 * A component outlet creates templates or components given a value.
 */
export function mixinComponentOutlet<
  T extends Constructor<Mixin<ComponentOutlet>>,
  V = any
>(base: T): ComponentOutletConstructor<V> & T {
  return class extends base {
    getProjectedComponent:
      | GetProjectedComponent<V>
      | Observable<GetProjectedComponent<V>>;
    _getProjectedComponent: GetProjectedComponent<V>;
    _getProjectedComponent$ = this.defineAccessors(
      'getProjectedComponent',
      null
    );

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
