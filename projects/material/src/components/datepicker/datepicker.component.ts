import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergDatepickerBase } from '@berglund/mixins';

@Component({
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'berg-datepicker',
  },
})
export class BergDatepickerComponent extends BergDatepickerBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
