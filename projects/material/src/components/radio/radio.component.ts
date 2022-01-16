import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergRadioBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: enumerateInputs(
    BergRadioComponent,
    'formControl',
    'connectToFormValue',
    'connectToFormError',
    'disabled',
    'required',
    'readonly',
    'data',
    'pluckLabel',
    'pluckDisabled',
    'pluckRearrangeable',
    'groupBy',
    'comparators',
    'selection',
    'hint',
    'label',
    'placeholder',
    'ariaLabel',
    'ariaLabelledby',
    'dataChanged'
  ),
  host: {
    class: 'berg-radio',
  },
})
export class BergRadioComponent extends BergRadioBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
