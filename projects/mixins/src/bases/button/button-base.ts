import { Directive, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Mixin,
  mixinEventEmitter,
  mixinInteractive,
  mixinLabel,
} from '../../mixins';

export type ButtonType = 'proceed' | 'cancel';
export type ButtonStyle = 'icon' | 'label';

@Directive()
export class BergButtonMixinBase extends Mixin {
  type: ButtonType | Observable<ButtonType>;
  _type: ButtonType;
  _type$ = this.defineAccessors('type', 'proceed');

  style: ButtonStyle | Observable<ButtonStyle>;
  _style: ButtonStyle;
  _style$ = this.defineAccessors('style', 'label');

  isError: boolean | Observable<boolean>;
  _isError: boolean;
  _isError$ = this.defineAccessors('isError', false);

  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergButtonBase = mixinInteractive(
  mixinLabel(mixinEventEmitter(BergButtonMixinBase))
);
