import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinButton,
  mixinCanConnect,
  mixinInteractive,
  mixinLabel,
} from '../../mixins';

@Directive()
export class BergButtonMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergButtonBase = mixinInteractive(
  mixinLabel(mixinCanConnect(mixinButton(BergButtonMixinBase)))
);
