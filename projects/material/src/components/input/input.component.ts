import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergInputBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: enumerateInputs(
    BergInputComponent,
    'formControl',
    'connectToFormValue',
    'connectToFormError',
    'disabled',
    'hint',
    'label',
    'placeholder',
    'ariaLabel',
    'ariaLabelledby',
    'getProjectedComponent',
    'required',
    'readonly',
    'type'
  ),
  host: {
    class: 'berg-input',
  },
})
export class BergInputComponent extends BergInputBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
