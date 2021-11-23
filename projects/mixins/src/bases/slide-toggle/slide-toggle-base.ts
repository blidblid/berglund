import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCanConnect,
  mixinFormControlParent,
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
    mixinFormControlParent(
      mixinLabel(
        mixinCanConnect<typeof BergSlideToggleMixinBase, boolean>(
          BergSlideToggleMixinBase
        )
      )
    )
  )
);
