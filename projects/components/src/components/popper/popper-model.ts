import { InjectionToken } from '@angular/core';

export const BERG_POPPER_INPUTS = new InjectionToken<BergPopperInputs>(
  'BERG_POPPER_INPUTS'
);

export interface BergPopperInputs {
  cursorOffset: number;

  followMouse: boolean;

  disabled: boolean;

  trigger: 'enter' | 'stationary';
}
