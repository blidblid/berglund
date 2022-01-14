import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergSlideToggleBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: enumerateInputs(
    BergSlideToggleComponent,
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
    class: 'berg-slide-toggle',
  },
})
export class BergSlideToggleComponent extends BergSlideToggleBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
