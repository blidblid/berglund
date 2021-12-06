import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'berg-layout-right-sidenav',
  templateUrl: 'layout-right-sidenav.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-layout-right-sidenav berg-layout-sidenav',
  },
})
export class BergLayoutRightSidenavComponent {}
