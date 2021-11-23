import { fromEvent, merge, Observable } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

/** Triggers when focus enters an element. Does not trigger if the element already has focus within. */
export function fromFocusEnter(elem: HTMLElement): Observable<FocusEvent> {
  const focusin$ = fromEvent<FocusEvent>(elem, 'focusin');
  const focusout$ = fromEvent<FocusEvent>(elem, 'focusout');

  return merge(focusin$, focusout$).pipe(
    throttleTime(0),
    filter((event) => event.type === 'focusin')
  );
}
