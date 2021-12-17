import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';

/** Triggers when a mouse pointer becomes stationary over an element. */
export function mouseStationary(
  element: HTMLElement,
  debounce = 250
): Observable<MouseEvent> {
  const mousemove$ = fromEvent<MouseEvent>(element, 'mousemove');
  const mouseleave$ = fromEvent<MouseEvent>(element, 'mouseleave');
  const mouseenter$ = fromEvent<MouseEvent>(element, 'mouseenter');
  const click$ = fromEvent<MouseEvent>(element, 'click');

  return mouseenter$.pipe(
    switchMap((mouseenterEvent) => {
      return mousemove$.pipe(
        debounceTime(debounce),
        map(() => mouseenterEvent),
        take(1),
        takeUntil(merge(mouseleave$, click$))
      );
    })
  );
}
