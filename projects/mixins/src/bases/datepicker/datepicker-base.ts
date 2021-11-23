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
export class BergDatepickerMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergDatepickerBase = mixinInteractive(
  mixinStateful(
    mixinFormControlParent(
      mixinLabel(
        mixinCanConnect<typeof BergDatepickerMixinBase, boolean>(
          BergDatepickerMixinBase
        )
      )
    )
  )
);
