import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'berg-layout-left-sidenav',
  templateUrl: 'layout-left-sidenav.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-layout-left-sidenav berg-layout-sidenav',
  },
})
export class BergLayoutLeftSidenavComponent {}
