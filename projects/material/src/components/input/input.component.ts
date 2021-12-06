import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergInputBase } from '@berglund/mixins';

@Component({
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-input',
  },
})
export class BergInputComponent extends BergInputBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
