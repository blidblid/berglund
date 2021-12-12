import {
  ComponentRef,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { ComponentOutletContext, COMPONENT_OUTLET_CONTEXT } from '../../mixins';
import { IncludeArray } from '../../util';
import {
  COMPONENT_INPUTS,
  MixinComponent,
  MixinComponentInputs,
} from './component-builder-model';

@Injectable({ providedIn: 'root' })
export class BergComponentBuilder {
  constructor(private injector: Injector) {}

  create<T, V>(
    mixinComponent: MixinComponent<T>,
    viewContainerRef: ViewContainerRef,
    context?: ComponentOutletContext<V>
  ): ComponentRef<T>;
  create<T, V>(
    mixinComponent: MixinComponent<T>[],
    viewContainerRef: ViewContainerRef,
    context?: ComponentOutletContext<V>
  ): ComponentRef<T>[];
  create<T, V>(
    mixinComponent: MixinComponent<T> | MixinComponent<T>[],
    viewContainerRef: ViewContainerRef,
    context?: ComponentOutletContext<V>
  ): IncludeArray<ComponentRef<T>> {
    if (!Array.isArray(mixinComponent)) {
      return this.createComponent(mixinComponent, viewContainerRef, context);
    }

    return mixinComponent.map((d) => {
      return this.createComponent(d, viewContainerRef, context);
    });
  }

  private createComponent<T>(
    mixinComponent: MixinComponent<T>,
    viewContainerRef: ViewContainerRef,
    context?: ComponentOutletContext
  ): ComponentRef<T> {
    const componentRef = viewContainerRef.createComponent(
      mixinComponent.component,
      {
        index: viewContainerRef.length,
        injector: this.createInjector(mixinComponent.inputs, context),
      }
    );

    return componentRef;
  }

  private createInjector<T>(
    inputs?: MixinComponentInputs<T>,
    context?: ComponentOutletContext
  ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: COMPONENT_INPUTS, useValue: inputs ?? null },
        { provide: COMPONENT_OUTLET_CONTEXT, useValue: context ?? null },
      ],
    });
  }
}
