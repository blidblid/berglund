import {
  A,
  BACKSPACE,
  ENTER,
  ESCAPE,
  NINE,
  SPACE,
  Z,
  ZERO,
} from '@angular/cdk/keycodes';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  isObservable,
  merge,
  Observable,
  of,
  Subject,
  timer,
  zip,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  share,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  NavigatorTarget,
  NAVIGATOR_RESET_TIME,
  NAVIGATOR_TARGETS,
} from './navigator-model';
import { searchSubString } from './navigator-util';

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  execute$: Observable<NavigatorTarget>;
  routing$: Observable<NavigatorTarget>;
  allNavigatorTargets$: Observable<NavigatorTarget[]>;

  private resetterSub = new Subject<void>();
  private routingSub = new BehaviorSubject<boolean>(true);
  private disabledTargetsSub = new BehaviorSubject<string[]>([]);

  private resolvedQuery$: Observable<NavigatorTarget | null>;
  private activeQuery$: Observable<string>;

  constructor(
    @Optional()
    @Inject(NAVIGATOR_TARGETS)
    private navigatorTargets: (
      | Observable<NavigatorTarget[]>
      | NavigatorTarget
    )[]
  ) {
    this.resolveNavigatorTargets();
    this.buildObservables();
  }

  getActiveQuery(): Observable<string> {
    return this.activeQuery$;
  }

  getResolvedQuery(): Observable<NavigatorTarget | null> {
    return this.resolvedQuery$;
  }

  getRouting(): Observable<NavigatorTarget> {
    return this.routing$;
  }

  getExecute(): Observable<NavigatorTarget> {
    return this.execute$;
  }

  setDisabledTargets(disabledTargets: string[]): void {
    return this.disabledTargetsSub.next(disabledTargets);
  }

  setRouting(enable: boolean): void {
    return this.routingSub.next(enable);
  }

  reset(): void {
    this.resetterSub.next();
  }

  private buildObservables(): void {
    const bodyMousemove$ = fromEvent<KeyboardEvent>(document.body, 'mousemove');
    const bodyKeydown$ = fromEvent<KeyboardEvent>(
      document.body,
      'keydown'
    ).pipe(
      filter((e) => !e.ctrlKey && !e.altKey && e.target === document.body)
    );

    const typingKeydown$ = bodyKeydown$.pipe(
      filter(
        (e) =>
          (e.keyCode >= A && e.keyCode <= Z) ||
          (e.keyCode >= ZERO && e.keyCode <= NINE) ||
          [ESCAPE, BACKSPACE, SPACE].includes(e.keyCode)
      ),
      map((event) => (event.keyCode === SPACE ? ' ' : event.key))
    );

    const resetter$: Observable<string> = merge(
      typingKeydown$.pipe(
        switchMap(() => {
          return merge(
            timer(NAVIGATOR_RESET_TIME * 2).pipe(take(1)),
            timer(NAVIGATOR_RESET_TIME).pipe(take(1), takeUntil(bodyMousemove$))
          );
        })
      ),
      this.resetterSub
    ).pipe(map(() => ''));

    const targets$ = combineLatest([
      this.allNavigatorTargets$,
      this.disabledTargetsSub,
    ]).pipe(
      map(([navigatorTargets, disabledTargets]) =>
        navigatorTargets.filter(
          (target) => !disabledTargets.includes(target.match)
        )
      )
    );

    this.activeQuery$ = merge(resetter$, typingKeydown$).pipe(
      withLatestFrom(targets$),
      scan((acc, [curr, targets]) => {
        if (!curr || curr === 'Backspace' || curr === 'Escape') {
          return '';
        }

        const newString = `${acc}${curr}`;

        if (
          targets.every((target) => !searchSubString(target.match, newString))
        ) {
          return curr;
        }

        return newString;
      }, ''),
      map((str) => str.toLowerCase()),
      distinctUntilChanged()
    );

    this.resolvedQuery$ = this.activeQuery$.pipe(
      withLatestFrom(targets$),
      map<any, [string, NavigatorTarget[]]>(([query, targets]) => {
        return [query, targets];
      }),
      map(([query, navigatorTargets]) => {
        return query
          ? navigatorTargets.filter((target) => {
              return searchSubString(target.match, query);
            })[0] || null
          : null;
      }),
      tap((resolvedQuery) => {
        if (!resolvedQuery) {
          this.resetterSub.next();
        }
      }),
      share()
    );

    this.execute$ = bodyKeydown$.pipe(
      filter((e) => e.keyCode === ENTER),
      withLatestFrom(this.resolvedQuery$),
      map(([, resolvedQuery]) => resolvedQuery),
      filter(
        (resolvedQuery): resolvedQuery is NavigatorTarget =>
          resolvedQuery !== null
      )
    );

    this.routing$ = this.execute$.pipe(
      withLatestFrom(this.routingSub),
      filter(([, enabled]) => enabled),
      map(([target]) => target)
    );
  }

  private resolveNavigatorTargets(): void {
    const async =
      this.navigatorTargets.filter(
        (target): target is Observable<NavigatorTarget[]> => {
          return isObservable(target);
        }
      ) || [];

    const sync =
      this.navigatorTargets.filter((target): target is NavigatorTarget => {
        return !isObservable(target);
      }) || [];

    const async$ = zip(async || []).pipe(
      map((targets) => targets.reduce((acc, curr) => [...acc, ...curr])),
      startWith([] as NavigatorTarget[])
    );

    const sync$ = of(sync);

    this.allNavigatorTargets$ = combineLatest([async$, sync$]).pipe(
      map(([async, sync]) =>
        [...async, ...sync].sort((a, b) => a.match.length - b.match.length)
      )
    );
  }
}
