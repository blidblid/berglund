import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinComponentOutlet,
  mixinCanConnect,
  mixinFormControlParent,
  mixinInteractive,
  mixinLabel,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergSelectMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergSelectBase = mixinInteractive(
  mixinFormControlParent(
    mixinStateful(
      mixinLabel(
        mixinCanConnect(
          mixinComponentOutlet(
            mixinCollection<typeof BergSelectMixinBase, 'radio' | 'multiple'>(
              BergSelectMixinBase
            )
          )
        )
      )
    )
  )
);
