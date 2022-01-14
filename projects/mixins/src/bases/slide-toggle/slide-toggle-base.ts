import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinForm,
  mixinInteractive,
  mixinLabel,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergSlideToggleMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergSlideToggleBase = mixinInteractive(
  mixinStateful(
    mixinLabel(
      mixinForm<typeof BergSlideToggleMixinBase, boolean>(
        BergSlideToggleMixinBase
      )
    )
  )
);
