import { InjectionToken } from '@angular/core';
import { BergPopperInputs } from './popper-model';

export const DEFAULT_INPUTS: BergPopperInputs = {
  cursorOffset: 12,
  disabled: false,
  trigger: 'stationary',
  followMouse: true,
};

export const BERG_POPPER_CONTENT = new InjectionToken<string>(
  'BERG_POPPER_CONTENT'
);
