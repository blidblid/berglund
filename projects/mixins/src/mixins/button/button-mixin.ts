import { ElementRef } from '@angular/core';
import { CanConnect } from '@berglund/rx';
import { fromEvent, merge, Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IncludeArray } from '../../util';
import {
  ComponentOutletContext,
  COMPONENT_OUTLET_CONTEXT,
} from '../component-outlet';
import { Constructor, Mixin, MixinApi } from '../core';
import { Button, ButtonStyle, ButtonType } from './button-model';

export type ButtonConstructor<V> = Constructor<MixinApi<Button<V>>>;

/** Anything stateless that triggers on user events is a button. */
export function mixinButton<
  T extends Constructor<Mixin<Button<V>> & CanConnect>,
  V = any
>(base: T): ButtonConstructor<V> & T {
  return class extends base {
    type: ButtonType | Observable<ButtonType>;
    _type: ButtonType;
    _type$ = this.defineAccessors('type', 'proceed');

    style: ButtonStyle | Observable<ButtonStyle>;
    _style: ButtonStyle;
    _style$ = this.defineAccessors('style', 'label');

    isError: boolean | Observable<boolean>;
    _isError: boolean;
    _isError$ = this.defineAccessors('isError', false);

    eventName: string | Observable<IncludeArray<string>>;
    _eventName: string;
    _eventName$: Observable<IncludeArray<string>> = this.defineAccessors(
      'eventName',
      'click'
    );

    context: V | Observable<V>;
    _context: V;
    _context$ = this.defineAccessors('context', null);

    private hostElem: HTMLElement =
      this._injector.get(ElementRef).nativeElement;

    override getChanges(): Observable<V | null> {
      return this._eventName$.pipe(
        switchMap((names) => {
          return merge(
            ...(Array.isArray(names) ? names : [names]).map((name) => {
              return fromEvent<T>(this.hostElem, name);
            })
          );
        }),
        withLatestFrom(this._context$),
        map(([, context]) => context ?? this.getInjectedContext())
      );
    }

    private getInjectedContext(): V | null {
      const injected = this._injector.get<ComponentOutletContext<V>>(
        COMPONENT_OUTLET_CONTEXT
      );

      return injected ? injected.context : null;
    }
  };
}
