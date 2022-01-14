import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinCollection,
  mixinComponentOutlet,
  mixinForm,
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
  mixinForm(
    mixinStateful(
      mixinLabel(
        mixinComponentOutlet(
          mixinCollection<typeof BergSelectMixinBase, 'radio' | 'multiple'>(
            BergSelectMixinBase
          )
        )
      )
    )
  )
);
