import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinForm,
  mixinInteractive,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergListMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergListBase = mixinInteractive(
  mixinForm(
    mixinStateful(
      mixinCollection<typeof BergListMixinBase, 'radio' | 'multiple'>(
        BergListMixinBase
      )
    )
  )
);
