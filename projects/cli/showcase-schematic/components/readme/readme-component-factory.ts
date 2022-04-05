import { prefixes } from '../../../../core';
import { ComponentFactory } from '../../core/component-factory';
import { Context } from '../../core/context';
import { ShowcaseComponentType } from '../../core/dom-builder-model';
import { TsComponentAstPrinter } from '../../core/ts-component-ast-printer';
import { ReadmeDomBuilder } from './readme-dom-builder';

export class ReadmeComponentFactory extends ComponentFactory {
  protected idPrefix = prefixes.readmeComponent;
  protected showcaseComponentType: ShowcaseComponentType = 'readme';

  constructor(
    protected context: Context,
    protected readmeDomBuilder: ReadmeDomBuilder,
    protected tsComponentAstPrinter: TsComponentAstPrinter
  ) {
    super(context, readmeDomBuilder, tsComponentAstPrinter);
  }

  create() {
    return this.createComponent(this.readmeDomBuilder.getExampleComponents());
  }
}
