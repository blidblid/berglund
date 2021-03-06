import { Directive, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Mixin,
  mixinForm,
  mixinInteractive,
  mixinLabel,
  mixinStateful,
} from '../../mixins';

@Directive()
export class BergCheckboxMixinBase extends Mixin {
  indeterminate: boolean | Observable<boolean>;
  _indeterminate: boolean;
  _indeterminate$: Observable<boolean> = this.defineAccessors(
    'indeterminate',
    false
  );

  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergCheckboxBase = mixinInteractive(
  mixinStateful(
    mixinLabel(
      mixinForm<typeof BergCheckboxMixinBase, boolean>(BergCheckboxMixinBase)
    )
  )
);
