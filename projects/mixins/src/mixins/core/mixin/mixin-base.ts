import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnDestroy,
} from '@angular/core';
import {
  shareReplayUntil,
  UserInputSubject,
  UserTriggerSubject,
} from '@berglund/rx';
import { isObservable, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { COMPONENT_INPUTS, MixinComponentInputs } from '../../../core';
import { Constructor } from './constructor';

type AddObservable<T> = {
  [P in keyof T]: T[P] | Observable<T[P]>;
};

/** Adds both sync and async properties of T. */
export type MixinApi<T> = AddObservable<T> &
  { [P in keyof T & string as `_${P}$`]: Observable<T[P]> } &
  { [P in keyof T & string as `_${P}`]: T[P] };

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
    initialValue: T[K]
  ): Observable<T[K]> {
    const injectedInput = this.getInjectedInput(key);

    const observable$ = merge(
      of(initialValue),
      injectedInput === this.noInjectedValueSymbol
        ? of(initialValue)
        : (injectedInput as Observable<T[K]>)
    ).pipe(shareReplayUntil(this.destroyed$));

    Object.defineProperty(this, key, {
      get: () => {
        throw new Error(
          `Do not access ${key}. Either use its observable form _${key}$ or its sync form _${key}.`
        );
      },
    });

    const syncKey = `_${key}`;
    let syncValue = initialValue;

    observable$
      .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        syncValue = value;
        this.changeDetectorRef.markForCheck();
      });

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
  ): Observable<T[K]> | Symbol {
    const inputs = this._injector.get<AddObservable<T> | null>(
      COMPONENT_INPUTS,
      null
    );

    if (!inputs || !(key in inputs)) {
      return this.noInjectedValueSymbol;
    }

    const value: T[K] | Observable<T[K]> = inputs[key];

    if (
      value instanceof UserInputSubject ||
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
