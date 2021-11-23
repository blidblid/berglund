import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinCanConnect,
  mixinFormControlParent,
  mixinInteractive,
  mixinNavigator,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergListMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergListBase = mixinInteractive(
  mixinNavigator(
    mixinFormControlParent(
      mixinStateful(
        mixinCanConnect(
          mixinCollection<typeof BergListMixinBase, 'radio' | 'multiple'>(
            BergListMixinBase
          )
        )
      )
    )
  )
);
