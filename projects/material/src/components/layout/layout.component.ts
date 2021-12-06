import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'berg-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-layout',
  },
})
export class BergLayoutComponent {
  mode$: Observable<MatDrawerMode> = of('side');
}
