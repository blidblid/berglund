import { Directive, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Mixin,
  mixinComponentOutlet,
  mixinForm,
  mixinInteractive,
  mixinLabel,
  mixinStateful,
} from '../../mixins';

export type BergInputType = 'text' | 'number' | 'password';

@Directive()
export class BergInputMixinBase extends Mixin {
  type: BergInputType | Observable<BergInputType>;
  _type: BergInputType;
  _type$: Observable<BergInputType> = this.defineAccessors('type', false);

  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergInputBase = mixinStateful(
  mixinInteractive(
    mixinLabel(
      mixinComponentOutlet(
        mixinForm<typeof BergInputMixinBase, string | number>(
          BergInputMixinBase
        )
      )
    )
  )
);
