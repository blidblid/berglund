import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergListBase } from '@berglund/mixins';
import { Observable } from 'rxjs';
import { map, share, withLatestFrom } from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-list',
  },
})
export class BergListComponent extends BergListBase {
  override getChanges(): Observable<any> {
    return this._formControl.valueChanges.pipe(
      withLatestFrom(this._multiple$),
      map(([value, multiple]) => (multiple ? value : value && value[0])),
      share()
    );
  }

  constructor(protected override injector: Injector) {
    super(injector);
  }
}
