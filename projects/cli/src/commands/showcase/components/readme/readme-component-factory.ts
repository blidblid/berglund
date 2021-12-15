import { TsComponentAstPrinter } from 'commands/showcase/core/ts-component-ast-printer';
import { prefixes } from '../../../../core/constants';
import { ComponentFactory } from '../../core/component-factory';
import { Context } from '../../core/context';
import { ShowcaseComponentType } from '../../core/dom-builder-model';
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
