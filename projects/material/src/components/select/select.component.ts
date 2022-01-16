import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergSelectBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: enumerateInputs(
    BergSelectComponent,
    'formControl',
    'connectToFormValue',
    'connectToFormError',
    'required',
    'readonly',
    'hint',
    'label',
    'placeholder',
    'ariaLabel',
    'ariaLabelledby',
    'getProjectedComponent',
    'data',
    'pluckLabel',
    'pluckDisabled',
    'pluckRearrangeable',
    'groupBy',
    'comparators',
    'selection',
    'disabled',
    'dataChanged'
  ),
  host: {
    class: 'berg-select',
  },
})
export class BergSelectComponent extends BergSelectBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
