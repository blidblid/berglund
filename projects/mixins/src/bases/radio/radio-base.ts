import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinForm,
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
    mixinForm(
      mixinStateful(
        mixinCollection<typeof BergRadioMixinBase, 'radio'>(BergRadioMixinBase)
      )
    )
  )
);
