import { TsComponentAstPrinter } from 'commands/showcase/core/ts-component-ast-printer';
import { prefixes } from '../../../../core/constants';
import { ComponentFactory } from '../../core/component-factory';
import { Context } from '../../core/context';
import { Component, ShowcaseComponentType } from '../../core/dom-builder-model';
import { ApiDomBuilder } from './api-dom-builder';

export class ApiComponentFactory extends ComponentFactory {
  protected idPrefix = prefixes.apiComponent;
  protected showcaseComponentType: ShowcaseComponentType = 'api';

  constructor(
    protected context: Context,
    protected apiDomBuilder: ApiDomBuilder,
    protected tsComponentAstPrinter: TsComponentAstPrinter
  ) {
    super(context, apiDomBuilder, tsComponentAstPrinter);
  }

  create(): Component | null {
    return this.createComponent();
  }
}
