import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergTextareaBase } from '@berglund/mixins';
import { Observable } from 'rxjs';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: enumerateInputs(
    BergTextareaComponent,
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
    'minRows',
    'maxRows'
  ),
  host: {
    class: 'berg-textarea',
  },
})
export class BergTextareaComponent extends BergTextareaBase {
  minRows: number | Observable<number>;
  _minRows$ = this.defineAccessors('minRows', 3);

  maxRows: number | Observable<number>;
  _maxRows$ = this.defineAccessors('maxRows', 5);

  constructor(protected override injector: Injector) {
    super(injector);
  }
}
