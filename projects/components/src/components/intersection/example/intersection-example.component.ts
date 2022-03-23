import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'berg-intersection-example',
  templateUrl: './intersection-example.component.html',
  styleUrls: ['./intersection-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionExampleComponent {}
