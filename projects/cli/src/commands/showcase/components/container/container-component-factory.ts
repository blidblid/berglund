import { ComponentFactory } from '../../core/component-factory';
import { Context } from '../../core/context';
import {
  Component,
  ContainerComponent,
  ShowcaseComponentType,
} from '../../core/dom-builder-model';
import { TsComponentAstPrinter } from '../../core/ts-component-ast-printer';
import { ContainerDomBuilder } from './container-dom-builder';

export class ContainerComponentFactory extends ComponentFactory {
  protected idPrefix = null;
  protected showcaseComponentType: ShowcaseComponentType = 'container';

  constructor(
    protected context: Context,
    protected containerDomBuilder: ContainerDomBuilder,
    protected tsComponentAstPrinter: TsComponentAstPrinter,
    private children: Component[]
  ) {
    super(context, containerDomBuilder, tsComponentAstPrinter);
  }

  async create(): Promise<ContainerComponent | null> {
    if (this.children.length === 0) {
      return null;
    }

    return {
      ...this.createComponent()!,
      name: this.context.name,
      children: this.children,
      type: this.resolveComponentType(),
    };
  }

  private resolveComponentType(): ShowcaseComponentType {
    if (this.context.isRoot) {
      return 'main';
    }

    return 'container';
  }
}
