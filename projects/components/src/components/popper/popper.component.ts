import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BERG_POPPER_CONTENT } from './popper-model-private';

@Component({
  selector: 'berg-popper',
  templateUrl: './popper.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BergPopperComponent {
  constructor(
    @Inject(BERG_POPPER_CONTENT) public content$: Observable<string>
  ) {}
}
