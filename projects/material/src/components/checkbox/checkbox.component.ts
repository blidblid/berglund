import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergCheckboxBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: enumerateInputs(
    BergCheckboxComponent,
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
    'disabled',
    'indeterminate'
  ),
  host: {
    class: 'berg-checkbox',
  },
})
export class BergCheckboxComponent extends BergCheckboxBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
