import { InjectionToken, Type } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Mixin } from '../../mixins';
import { OmitPrivates, OmitType } from '../../util';

export type MixinComponentInputs<C> = Partial<
  OmitType<OmitPrivates<C>, MixinComponentValueAccessor & Mixin>
>;

export type MixinComponentValueAccessor = Partial<ControlValueAccessor>;

export interface MixinComponent<C = any> {
  component: Type<C>;
  inputs?: MixinComponentInputs<C>;
}

export const COMPONENT_INPUTS = new InjectionToken<MixinComponentInputs<any>>(
  'COMPONENT_INPUTS'
);
