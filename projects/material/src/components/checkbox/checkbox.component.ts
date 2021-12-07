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
    'required',
    'readonly',
    'hint',
    'label',
    'placeholder',
    'ariaLabel',
    'ariaLabelledby',
    'connect',
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
