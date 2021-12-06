import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergRadioBase } from '@berglund/mixins';

@Component({
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'berg-radio',
  },
})
export class BergRadioComponent extends BergRadioBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
