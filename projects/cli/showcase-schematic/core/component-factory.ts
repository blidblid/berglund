import { dashCaseToPascalCase, File, toRelativePath } from '../../../core';
import { Context } from './context';
import { DomBuilder } from './dom-builder';
import { Component, ExampleComponent, ShowcaseComponentType } from './dom-builder-model';
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

  protected createComponent(examples: ExampleComponent[] = []): Component | null {
    const dom = this.domBuilder.getDom();

    if (!dom) {
      return null;
    }

    const domData = this.domBuilder.getDomData();

    const id = this.idPrefix === null ? this.context.id : `${this.idPrefix}-${this.context.id}`;

    const templateUrl = toRelativePath(`${id}.component.html`);
    const pascalId = dashCaseToPascalCase(id);
    const moduleClassName = `${pascalId}Module`;
    const componentClassName = `${pascalId}Component`;
    const exampleFiles = examples.reduce((acc, curr) => [...acc, ...curr.files], [] as File[]);

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
      content: this.tsComponentAstPrinter.createNgModuleContent(moduleClassName, componentFile, exampleFiles),
      fileName: `${id}.module.ts`,
      decorator: 'module',
      className: moduleClassName,
    });

    let name: string = this.showcaseComponentType;

    if (this.showcaseComponentType === 'readme' && this.context.showcaseOptions.readmeName) {
      name = this.context.showcaseOptions.readmeName;
    }

    if (this.showcaseComponentType === 'editor' && this.context.showcaseOptions.editorName) {
      name = this.context.showcaseOptions.editorName;
    }

    return {
      ...domData,
      id,
      name,
      examples,
      type: this.showcaseComponentType,
      files: [componentFile, ngModuleFile, templateFile],
      category: this.context.featureOptions.category,
      componentFile,
      ngModuleFile,
      templateFile,
    };
  }
}
