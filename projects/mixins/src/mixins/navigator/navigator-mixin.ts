import { ActivatedRoute, Router } from '@angular/router';
import { CanConnect } from '@berglund/rx';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Constructor, Mixin, MixinApi } from '../core';
import {
  Navigator,
  NavigatorGetValue,
  NavigatorUpdateRoute,
} from './navigator-model';

type NavigatorMixin<T> = MixinApi<Navigator<T>>

export type NavigatorConstructor<T> = Constructor<NavigatorMixin<T>>;

/**
 * A navigator mirrors its state with the @angular/router.
 */
export function mixinNavigator<
  T extends Constructor<Mixin<Navigator<V>> & CanConnect<V>>,
  V = any
>(base: T): NavigatorConstructor<V> & T {
  return class extends base {
    getValueFromRoute: NavigatorGetValue<V> | Observable<NavigatorGetValue<V>>;
    _getValueFromRoute: NavigatorGetValue<V>;
    _getValueFromRoute$ = this.defineAccessors('getValueFromRoute', null);

    updateRouteFromValue:
      | NavigatorUpdateRoute<V>
      | Observable<NavigatorUpdateRoute<V>>;
    _updateRouteFromValue: NavigatorUpdateRoute<V>;
    _updateRouteFromValue$ = this.defineAccessors('updateRouteFromValue', null);

    constructor(...args: any[]) {
      super(...args);

      const router = this._injector.get(Router);
      const activatedRoute = this._injector.get(ActivatedRoute);

      if (this.getChanges) {
        combineLatest([this.getChanges(), this._updateRouteFromValue$])
          .pipe(takeUntil(this.destroyed$))
          .subscribe(([value, updateRoute]) => {
            if (updateRoute) {
              updateRoute(value, router);
            }
          });
      }

      combineLatest([
        this._getValueFromRoute$.pipe(
          filter(
            (getValue): getValue is NavigatorGetValue<V> => getValue !== null
          )
        ),
        activatedRoute.url,
      ])
        .pipe(
          map(([getValue]) => getValue(activatedRoute.snapshot)),
          takeUntil(this.destroyed$)
        )
        .subscribe((value) => {
          if (this.update) {
            this.update(value, true);
          }
        });
    }
  };
}
