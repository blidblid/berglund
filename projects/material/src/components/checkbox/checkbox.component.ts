import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergCheckboxBase } from '@berglund/mixins';

@Component({
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'berg-checkbox',
  },
})
export class BergCheckboxComponent extends BergCheckboxBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
