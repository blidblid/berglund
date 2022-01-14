import { Directive, Injector } from '@angular/core';
import {
  Mixin,
  mixinForm,
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
  mixinStateful(
    mixinLabel(
      mixinForm<typeof BergTextareaMixinBase, string>(BergTextareaMixinBase)
    )
  )
);
