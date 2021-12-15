import { dashCaseToPascalCase, toRelativePath } from '../../../core/util';
import { Context } from './context';
import { DomBuilder } from './dom-builder';
import {
  Component,
  ExampleComponent,
  File,
  ShowcaseComponentType,
} from './dom-builder-model';
import { TsComponentAstPrinter } from './ts-component-ast-printer';

export abstract class ComponentFactory {
  protected abstract idPrefix: string | null;
  protected abstract showcaseComponentType: ShowcaseComponentType;

  abstract create(): Component | null;

  constructor(
    protected context: Context,
    protected domBuilder: DomBuilder,
    protected tsComponentAstPrinter: TsComponentAstPrinter
  ) {}

  protected createComponent(
    examples: ExampleComponent[] = []
  ): Component | null {
    const dom = this.domBuilder.getDom();

    if (!dom) {
      return null;
    }

    const domData = this.domBuilder.getDomData();

    const id =
      this.idPrefix === null
        ? this.context.id
        : `${this.idPrefix}-${this.context.id}`;

    const templateUrl = toRelativePath(`${id}.component.html`);
    const pascalId = dashCaseToPascalCase(id);
    const moduleClassName = `${pascalId}Module`;
    const componentClassName = `${pascalId}Component`;
    const exampleFiles = examples.reduce(
      (acc, curr) => [...acc, ...curr.files],
      [] as File[]
    );

    const componentFile = this.domBuilder.createFile({
      id,
      content: this.tsComponentAstPrinter.createComponentContent(
        id,
        componentClassName,
        templateUrl,
        exampleFiles,
        domData.titleIds
      ),
      fileName: `${id}.component.ts`,
      decorator: 'component',
      className: componentClassName,
    });

    const templateFile = this.domBuilder.createFile({
      id,
      content: dom.serialize(),
      fileName: templateUrl,
    });

    const ngModuleFile = this.domBuilder.createFile({
      id,
      content: this.tsComponentAstPrinter.createNgModuleContent(
        moduleClassName,
        componentFile,
        exampleFiles
      ),
      fileName: `${id}.module.ts`,
      decorator: 'module',
      className: moduleClassName,
    });

    return {
      ...domData,
      id,
      name: this.showcaseComponentType,
      examples,
      type: this.showcaseComponentType,
      files: [componentFile, ngModuleFile, templateFile],
      category: this.context.featureConfig.category,
      componentFile,
      ngModuleFile,
      templateFile,
    };
  }
}
