import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { SMALL_BREAKPOINT, LARGE_BREAKPOINT, MOBILE_BREAKPOINT } from './breakpoint-model';


@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private matches$: Observable<BreakpointState>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.buildObservables();
  }

  mobileMatches(): boolean {
    return this.breakpointObserver.isMatched(MOBILE_BREAKPOINT);
  }

  smallMatches(): boolean {
    return this.breakpointObserver.isMatched(SMALL_BREAKPOINT);
  }

  largeMatches(): boolean {
    return this.breakpointObserver.isMatched(LARGE_BREAKPOINT);
  }

  getMatches(): Observable<BreakpointState> {
    return this.matches$;
  }

  private buildObservables(): void {
    this.matches$ = this.breakpointObserver.observe([
      MOBILE_BREAKPOINT,
      SMALL_BREAKPOINT,
      LARGE_BREAKPOINT
    ]).pipe(
      shareReplay(1)
    );
  }
}
