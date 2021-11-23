import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinCanConnect,
  mixinFormControlParent,
  mixinInteractive,
  mixinLabel,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergRadioMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergRadioBase = mixinLabel(
  mixinInteractive(
    mixinFormControlParent(
      mixinStateful(
        mixinCanConnect(
          mixinCollection<typeof BergRadioMixinBase, 'radio'>(
            BergRadioMixinBase
          )
        )
      )
    )
  )
);
