import { ElementRef } from '@angular/core';
import { connect, Connectable } from '@berglund/rx';
import { fromEvent, map, merge, Observable, switchMap, takeUntil } from 'rxjs';
import {
  ComponentOutletContext,
  COMPONENT_OUTLET_CONTEXT,
} from '../component-outlet';
import { Constructor } from '../core/mixin/constructor';
import { Mixin, MixinApi } from '../core/mixin/mixin-base';
import { EventEmitter } from './event-emitter-model';

interface EventEmitterMixin<T> extends MixinApi<EventEmitter<T>> {
  _eventTarget: HTMLElement | null;
}

export type EventEmitterConstructor<T> = Constructor<EventEmitterMixin<T>>;

export function mixinEventEmitter<
  T extends Constructor<Mixin<EventEmitter<V>>> = any,
  V = any
>(base: T): EventEmitterConstructor<V> & T {
  return class extends base {
    eventName: string | Observable<string>;
    _eventName: string;
    _eventName$ = this.defineAccessors('eventName', 'click');

    connectToEvent: Connectable<V> | Observable<Connectable<V>>;
    _connectToEvent: Connectable<V>;
    _connectToEvent$ = this.defineAccessors('connectToEvent');

    context: V | Observable<V>;
    _context: V;
    _context$ = this.defineAccessors('context');

    _eventTarget: HTMLElement | null;

    constructor(...args: any[]) {
      super(...args);

      const event$ = this._eventName$.pipe(
        switchMap((names) => {
          return merge(
            ...(Array.isArray(names) ? names : [names]).map((name) => {
              return fromEvent<T>(
                this._eventTarget ??
                  this._injector.get(ElementRef).nativeElement,
                name
              );
            })
          );
        }),
        map(() => this._context ?? this.getInjectedContext())
      );

      this._connectToEvent$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((connectToEvent) => {
          connect(connectToEvent, event$, this.destroyed$);
        });
    }

    private getInjectedContext(): V | null {
      const injected = this._injector.get<ComponentOutletContext<V>>(
        COMPONENT_OUTLET_CONTEXT
      );

      return injected ? injected.context : null;
    }
  };
}
