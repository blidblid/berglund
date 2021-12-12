import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const BERG_POPPER_INPUTS = new InjectionToken<BergPopperInputs>(
  'BERG_POPPER_INPUTS'
);

export const BERG_POPPER_DEFAULT_INPUTS: BergPopperInputs = {
  cursorOffset: 12,
  disabled: false,
  closeTrigger: 'mouseleave',
  openTrigger: 'mousestationary',
  followMouse: true,
};

export interface BergPopperInputs {
  cursorOffset: number;
  followMouse: boolean;
  disabled: boolean;
  openTrigger: BergPopperOpenTrigger;
  closeTrigger: BergPopperCloseTrigger;
}

export type BergPopperOpenTrigger =
  | 'mouseenter'
  | 'mousestationary'
  | ((element: HTMLElement) => Observable<any>);

export type BergPopperCloseTrigger =
  | 'mouseleave'
  | ((element: HTMLElement) => Observable<any>);
