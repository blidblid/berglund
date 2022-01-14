import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { BergListBase } from '@berglund/mixins';
import { enumerateInputs } from '../../util';

@Component({
  selector: 'berg-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: enumerateInputs(
    BergListComponent,
    'formControl',
    'connectToForm',
    'required',
    'readonly',
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
    class: 'berg-list',
  },
})
export class BergListComponent extends BergListBase {
  constructor(protected override injector: Injector) {
    super(injector);
  }
}
