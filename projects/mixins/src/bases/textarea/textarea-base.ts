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
export class BergTextareaMixinBase extends Mixin {
  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergTextareaBase = mixinInteractive(
  mixinFormControlParent(
    mixinStateful(
      mixinLabel(
        mixinCanConnect<typeof BergTextareaMixinBase, string>(
          BergTextareaMixinBase
        )
      )
    )
  )
);
