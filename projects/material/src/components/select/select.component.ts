import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergSelectBase } from '@berglund/mixins';

@Component({
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-select',
  },
})
export class BergSelectComponent extends BergSelectBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
