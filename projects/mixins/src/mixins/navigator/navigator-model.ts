import { ActivatedRouteSnapshot, Router } from '@angular/router';

export interface Navigator<T = any> {
  /** Function to update route from a value T. */
  updateRouteFromValue: NavigatorUpdateRoute<T> | null;

  /** Function to get a value T from the route. */
  getValueFromRoute: NavigatorGetValue<T> | null;
}

export type NavigatorUpdateRoute<T> = (value: T, router: Router) => void;
export type NavigatorGetValue<T> = (
  activatedRoute: ActivatedRouteSnapshot
) => T;
