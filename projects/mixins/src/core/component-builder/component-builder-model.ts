import { InjectionToken, Type } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanConnect } from '@berglund/rx';
import { Mixin } from '../../mixins';
import { OmitPrivates, OmitType } from '../../util';

export type MixinComponentInputs<C> = Partial<
  OmitType<OmitPrivates<C>, MixinComponentValueAccessor & Mixin>
>;

export interface MixinComponentValueAccessor<T = any>
  extends Partial<ControlValueAccessor>,
    Partial<CanConnect<T>> {}

export interface MixinComponent<C = any> {
  component: Type<C>;
  inputs?: MixinComponentInputs<C>;
}

export const COMPONENT_INPUTS = new InjectionToken<MixinComponentInputs<any>>(
  'COMPONENT_INPUTS'
);
