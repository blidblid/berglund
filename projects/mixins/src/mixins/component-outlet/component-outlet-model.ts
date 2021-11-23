import { InjectionToken } from '@angular/core';
import { MixinComponent } from '../../core';

export const COMPONENT_OUTLET_CONTEXT =
  new InjectionToken<ComponentOutletContext>('COMPONENT_OUTLET_CONTEXT');

export type GetProjectedComponent<T = any> = (
  value: T
) => MixinComponent | MixinComponent[] | null;

export interface ComponentOutletContext<T = any> {
  context: T;
}

export interface ComponentOutlet<T = any> {
  /** Component or template to create at a specific value. */
  getProjectedComponent: GetProjectedComponent<T> | null;
}
