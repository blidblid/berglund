import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergDatepickerBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: enumerateInputs(
    BergDatepickerComponent,
    'formControl',
    'connectToForm',
    'required',
    'readonly',
    'hint',
    'label',
    'placeholder',
    'ariaLabel',
    'ariaLabelledby',
    'disabled'
  ),
  host: {
    class: 'berg-datepicker',
  },
})
export class BergDatepickerComponent extends BergDatepickerBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
