import { Directive, ElementRef, Input, NgZone, Output } from '@angular/core';
import { filter, switchMap, take } from 'rxjs/operators';
import { BergIntersectionDirective } from './intersection.directive';

@Directive({
  selector: '[bergIntersectionNode]',
})
export class BergIntersectionNodeDirective {
  @Input('bergIntersectionNodeDisabled') disabled: boolean;

  @Output('bergIntersectionNodeChange')
  intersecting$ = this.zone.onStable.pipe(
    take(1),
    switchMap(() => this.intersection.observe(this.elementRef.nativeElement)),
    filter(() => !this.disabled)
  );

  constructor(
    private intersection: BergIntersectionDirective,
    private elementRef: ElementRef,
    private zone: NgZone
  ) {}
}
