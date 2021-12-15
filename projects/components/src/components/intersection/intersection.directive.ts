import { Directive, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Directive({
  selector: '[bergIntersection]',
})
export class BergIntersectionDirective {
  intersectionObserver = new IntersectionObserver(
    (entry) => this.intersectionEntriesSub.next(entry),
    {
      root: this.elementRef.nativeElement,
      rootMargin: '0px',
      threshold: 1.0,
    }
  );

  private intersectionEntriesSub = new Subject<IntersectionObserverEntry[]>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  observe(element: HTMLElement): Observable<boolean> {
    this.intersectionObserver.observe(element);

    return this.intersectionEntriesSub.asObservable().pipe(
      map((entries) => entries.find((entry) => entry.target === element)),
      filter((entry): entry is IntersectionObserverEntry => !!entry),
      map((entry) => entry.isIntersecting)
    );
  }

  unobserve(element: HTMLElement) {
    this.intersectionObserver.unobserve(element);
  }
}
