import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  BreakpointService,
  MOBILE_BREAKPOINT,
  SMALL_BREAKPOINT,
} from '@showcase/core';
import { SHOWCASE_CONFIG } from 'generated/showcase';
import { map, take } from 'rxjs/operators';
import {
  CATEGORIZED_FEATURES,
  UNCATEGORIZED_FEATURES,
} from '../../generated/features';
import { TOP_NAV } from './main-model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'breakpointClass',
    '[class.app-main]': 'true',
  },
})
export class MainComponent {
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;

  topNav = TOP_NAV;
  uncategorizedSideNav = UNCATEGORIZED_FEATURES;
  categorizedSideNav = CATEGORIZED_FEATURES;
  name = SHOWCASE_CONFIG.name;
  externalLinks = SHOWCASE_CONFIG.appExternalLinks;
  breakpointClass: string;

  breakpointClass$ = this.breakpoint.getMatches().pipe(
    map((breakpoint) => {
      if (breakpoint.breakpoints[MOBILE_BREAKPOINT]) {
        return 'app-main-mobile app-main-small';
      } else if (breakpoint.breakpoints[SMALL_BREAKPOINT]) {
        return 'app-main-small';
      } else {
        return 'app-main-large';
      }
    })
  );

  sidenavMode$ = this.breakpoint.getMatches().pipe(
    map((breakpoint) => breakpoint.breakpoints[MOBILE_BREAKPOINT]),
    map((matches) => (matches ? 'over' : 'side'))
  );

  sidenavOpen$ = this.sidenavMode$.pipe(
    take(1),
    map((mode) => mode === 'side')
  );
  constructor(private breakpoint: BreakpointService) {
    this.breakpointClass$.subscribe(
      (breakpointClass) => (this.breakpointClass = breakpointClass)
    );
  }

  toggleSidenav(): void {
    void this.sidenav.toggle();
  }
}
