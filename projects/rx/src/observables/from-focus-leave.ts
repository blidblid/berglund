import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

/** Triggers when focus leaves an element. */
export function fromFocusLeave(elem: HTMLElement): Observable<FocusEvent> {
  const focusin$ = fromEvent<FocusEvent>(elem, 'focusin');
  const focusout$ = fromEvent<FocusEvent>(elem, 'focusout');

  return merge(focusin$, focusout$).pipe(
    debounceTime(0),
    filter((event) => event.type === 'focusout')
  );
}
