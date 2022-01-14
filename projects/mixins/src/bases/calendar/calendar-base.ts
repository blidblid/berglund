import { Directive, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Mixin,
  mixinCollection,
  mixinComponentOutlet,
  mixinInteractive,
  mixinStateful,
} from '../../mixins';

export interface BergDateRange {
  start: Date | null;
  end: Date | null;
}

export type BergCalendarDate = Date | BergDateRange | null;

@Directive()
export class BergCalendarMixinBase extends Mixin {
  isRange: boolean | Observable<boolean>;
  _isRange$: Observable<boolean> = this.defineAccessors('isRange', false);

  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergCalendarBase = mixinInteractive(
  mixinStateful(mixinCollection(mixinComponentOutlet(BergCalendarMixinBase)))
);
