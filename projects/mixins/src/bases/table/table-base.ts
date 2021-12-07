import { Directive, Injector } from '@angular/core';
import { safeUnflatten } from '@berglund/rx';
import { Observable } from 'rxjs';
import { filter, map, pluck } from 'rxjs/operators';
import { MixinComponent } from '../../core';
import {
  Mixin,
  mixinCollection,
  mixinComponentOutlet,
  mixinInteractive,
  mixinLabel,
} from '../../mixins';

export interface ExpandRowComponent<T = any> {
  value: T | Observable<T>;
  component: MixinComponent | MixinComponent[] | null;
}

export interface BergTableColumn {
  key: string;
  label?: string;
}

@Directive()
export class BergTableMixinBase extends Mixin {
  columns: BergTableColumn[] | Observable<BergTableColumn[]>;
  _columns$: Observable<BergTableColumn[]> = this.defineAccessors(
    'columns',
    []
  );

  _keys$ = this._columns$.pipe(
    map((columns) => columns.map((column) => column.key))
  );

  expandRowComponent: ExpandRowComponent | Observable<ExpandRowComponent>;
  _expandRowComponent: ExpandRowComponent;
  _expandRowComponent$ = this.defineAccessors('expandRowComponent', null);

  _expandRowComponentValue$ = this._expandRowComponent$.pipe(
    filter((expandRowComponent): expandRowComponent is ExpandRowComponent => {
      return expandRowComponent !== null;
    }),
    pluck('value'),
    safeUnflatten()
  );

  constructor(protected injector: Injector) {
    super(injector);
  }
}

export const BergTableBase = mixinInteractive(
  mixinCollection(mixinLabel(mixinComponentOutlet(BergTableMixinBase)))
);
