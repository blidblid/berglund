import { ParamMap } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Observable, combineLatest, MonoTypeOperatorFunction, fromEvent, merge } from 'rxjs';
import { map, shareReplay, takeUntil, switchMap, debounceTime, take, filter, pluck } from 'rxjs/operators';


export function paginate<T>(source: Observable<T[]>, pageEvent: Observable<PageEvent>): Observable<T[]> {
  return combineLatest([source, pageEvent]).pipe(
    map(([results, page]) => {
      const startAt = page.pageIndex * page.pageSize;
      return results.slice(startAt, startAt + page.pageSize);
    })
  );
}

export function pluckArray<T, K extends keyof T>(source: Observable<T[]>, key: K): Observable<T[K][]> {
  return source.pipe(
    map(array => array.map(element => element[key]))
  );
}

export function safePluck<T, K extends keyof T>(key: K): (source: Observable<T>) => Observable<T[K]> {
  return (source: Observable<T>): Observable<T[K]> => {
    return source.pipe(
      filter(value => value !== undefined && value !== null),
      pluck(key)
    );
  };
}

export function pluckParamMap(paramMap$: Observable<ParamMap>, id = 'id'): Observable<string> {
  return paramMap$.pipe(
    map(paramMap => paramMap.get(id))
  );
}

export function shareReplayUntil<T>(takeUntil$: Observable<void>): MonoTypeOperatorFunction<T> {
  return (source$): Observable<T> => source$.pipe(takeUntil(takeUntil$), shareReplay(1));
}

export function mouseStationary(element: HTMLElement, debounce = 250): Observable<MouseEvent> {
  const mousemove$ = fromEvent<MouseEvent>(element, 'mousemove');
  const mouseleave$ = fromEvent<MouseEvent>(element, 'mouseleave');
  const mouseenter$ = fromEvent<MouseEvent>(element, 'mouseenter');
  const click$ = fromEvent<MouseEvent>(element, 'click');

  return mouseenter$.pipe(
    switchMap(mouseenterEvent => {
      return mousemove$.pipe(
        debounceTime(debounce),
        map(() => mouseenterEvent),
        take(1),
        takeUntil(merge(mouseleave$, click$))
      );
    })
  );
}
