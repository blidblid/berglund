import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnDestroy,
} from '@angular/core';
import {
  shareReplayUntil,
  UserErrorSubject,
  UserTriggerSubject,
  UserValueSubject,
} from '@berglund/rx';
import { EMPTY, isObservable, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { COMPONENT_INPUTS, MixinComponentInputs } from '../../../core';
import { Constructor } from './constructor';

type AddObservable<T> = {
  [P in keyof T]: T[P] | Observable<T[P]>;
};

/** Adds both sync and async properties of T. */
export type MixinApi<T> = AddObservable<T> & {
  [P in keyof T & string as `_${P}$`]: Observable<T[P]>;
} & { [P in keyof T & string as `_${P}`]: T[P] };

/** Omits everything from T that is not an input. */
export type MixinInputs<T> = MixinComponentInputs<ExtractConstructor<T>>;

type ExtractConstructor<T> = {
  [P in keyof T]: T[P] extends Constructor<infer U> ? U : never;
};

/** Base class for all mixins. */
@Directive()
export class Mixin<T = any> implements OnDestroy {
  private destroySub = new Subject<void>();
  protected destroyed$ = this.destroySub.asObservable();

  private noInjectedValueSymbol = Symbol();

  private get changeDetectorRef(): ChangeDetectorRef {
    return this._injector.get(ChangeDetectorRef);
  }

  constructor(protected _injector: Injector) {}

  /**
   * Creates a sync and an async form of `key` called `_key` and `_key$`.
   *
   * This means the component consumer can input `T[K]` or `Observable<T[K]>`,
   * while the component implementor can use either.
   */
  protected defineAccessors<K extends keyof AddObservable<T>>(
    key: K,
    initialValue?: T[K]
  ): Observable<T[K]> {
    const injectedInput = this.getInjectedInput(key);
    const setterSub = new Subject<T[K]>();
    const initialValue$ = initialValue === undefined ? EMPTY : of(initialValue);
    const injectedValue$ =
      injectedInput === this.noInjectedValueSymbol
        ? EMPTY
        : (injectedInput as Observable<T[K]>);

    const observable$ = merge(setterSub, initialValue$, injectedValue$).pipe(
      shareReplayUntil(this.destroyed$)
    );

    Object.defineProperty(this, key, {
      get: () => {
        throw new Error(
          `Do not access ${key}. Either use its observable form _${key}$ or its sync form _${key}.`
        );
      },
      set: (value: T[K]) => setterSub.next(value),
    });

    let syncValue = initialValue;

    observable$
      .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        syncValue = value;
        this.changeDetectorRef.markForCheck();
      });

    const syncKey = `_${key}`;

    Object.defineProperty(this, syncKey, {
      set: () => {
        throw new Error(`Do not set ${syncKey}. Set ${key} instead.`);
      },
      get: () => syncValue,
    });

    return observable$;
  }

  private getInjectedInput<K extends keyof T>(
    key: K
  ): Observable<T[K]> | symbol {
    const inputs = this._injector.get<AddObservable<T> | null>(
      COMPONENT_INPUTS,
      null
    );

    if (!inputs || !(key in inputs)) {
      return this.noInjectedValueSymbol;
    }

    const value: T[K] | Observable<T[K]> = inputs[key];

    if (
      value instanceof UserErrorSubject ||
      value instanceof UserValueSubject ||
      value instanceof UserTriggerSubject
    ) {
      return of(value as any);
    }

    return isObservable(value) ? value : of(value);
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
