import { BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asapScheduler, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil } from 'rxjs/operators';

const MOBILE_BREAKPOINT = '(max-width: 800px)';

@Directive()
export abstract class BergShowcaseBase {
  isMobile$ = this.breakpointObserver
    .observe(MOBILE_BREAKPOINT)
    .pipe(map((breakpoint) => breakpoint.matches));

  abstract id: string;
  abstract titleIds: string[];

  private destroySub = new Subject<void>();
  private intersectionSub = new Subject<void>();
  private intersectingSet = new Set<string>();
  private intersectionObserverDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subscribe();
  }

  routeIncludesType(type: string): boolean {
    return this.router.url.split('/')[2] === type;
  }

  navigateToChild(url: string): void {
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  onIntersectionChanged(intersecting: boolean, htmlId: string): void {
    if (intersecting) {
      this.intersectingSet.add(htmlId);
    } else {
      this.intersectingSet.delete(htmlId);
    }

    this.intersectionSub.next();
  }

  isActiveRoute(id: string): boolean {
    return this.location.path().endsWith(`/${id}`);
  }

  updateLocationWithId(id: string, scrollIntoView = false): void {
    const segments = this.router.url.split('/');

    if (segments[segments.length - 1] === this.id) {
      segments.push(id);
    } else {
      segments[segments.length - 1] = id;
    }

    // this will get throttled by the browser sometimes, seems to be no way around that
    this.location.replaceState(segments.join('/'));

    if (scrollIntoView) {
      this.scrollElementIntoView(id);
    }
  }

  private subscribe(): void {
    this.activatedRoute.paramMap
      .pipe(delay(0, asapScheduler), take(1), takeUntil(this.destroySub))
      .subscribe((paramMap) => {
        const id = paramMap.get('id');

        if (id && id !== this.titleIds[0]) {
          this.scrollElementIntoView(id);
        }
      });

    this.intersectionSub
      .pipe(
        filter(() => !this.intersectionObserverDisabled),
        takeUntil(this.destroySub)
      )
      .subscribe(() => {
        const firstIdIndex = this.titleIds.findIndex((id) => {
          return this.intersectingSet.has(id);
        });

        // scrollIntoView makes the first item outside according to resize observer.
        const firstId = this.titleIds[firstIdIndex - 1];

        if (firstId) {
          this.updateLocationWithId(firstId);
        }
      });
  }

  private scrollElementIntoView(id: string): void {
    this.intersectionObserverDisabled = true;
    document.getElementById(id)?.scrollIntoView();

    // This is ugly, but there is no way of knowing if scrollIntoView has finished.
    setTimeout(() => (this.intersectionObserverDisabled = false), 100);
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
