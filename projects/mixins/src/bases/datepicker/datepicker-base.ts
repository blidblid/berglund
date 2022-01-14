import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinForm,
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
    mixinLabel(
      mixinForm<typeof BergDatepickerMixinBase, Date>(BergDatepickerMixinBase)
    )
  )
);
