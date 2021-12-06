import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergSlideToggleBase } from '@berglund/mixins';

@Component({
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'berg-slide-toggle',
  },
})
export class BergSlideToggleComponent extends BergSlideToggleBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
