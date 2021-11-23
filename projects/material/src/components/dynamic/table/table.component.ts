import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { BergTableBase } from '@berglund/mixins';
import { combineLatest } from 'rxjs';
import { map, pluck, startWith } from 'rxjs/operators';

@Component({
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-table',
  },
})
export class BergTableComponent extends BergTableBase {
  _everyValueComponentKey = 'everyValueComponent';

  _renderKeys$ = combineLatest([
    this._keys$,
    this._getProjectedComponent$.pipe(startWith(null)),
  ]).pipe(
    map(([keys, getProjectedComponent]) => {
      return getProjectedComponent
        ? [...keys, this._everyValueComponentKey]
        : keys;
    })
  );

  _keysLength$ = this._renderKeys$.pipe(pluck('length'));

  onSort(sort: Sort) {
    this._sortCollection({
      key: sort.active,
      descending: sort.direction === 'desc',
    });
  }
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
