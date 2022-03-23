import { Context } from 'commands/showcase/core/context';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import { TsAstParser } from '../../../../core';
import { DomBuilder } from '../../core/dom-builder';
import { ExampleComponent, File } from '../../core/dom-builder-model';

export class ReadmeDomBuilder extends DomBuilder {
  private exampleComponents = this.findExampleComponentPaths();

  constructor(
    protected jsdom: JSDOM,
    private context: Context,
    private tsAstParser: TsAstParser
  ) {
    super(jsdom);

    for (const exampleComponent of this.exampleComponents) {
      this.addTabComponent(exampleComponent);
    }

    this.addCommon();
  }

  getDom(): JSDOM | null {
    return this.jsdom;
  }

  getExampleComponents(): ExampleComponent[] {
    return this.exampleComponents;
  }

  private addTabComponent(exampleComponent: ExampleComponent): void {
    if (exampleComponent.files.length === 0) {
      return;
    }

    const card = this.document.createElement(this.cardTagName);
    const tabGroup = this.document.createElement(this.tabGroupTagName);

    const reference = this.document.createElement('div');
    exampleComponent.containerElement.insertBefore(
      reference,
      exampleComponent.referenceNode
    );

    const componentFile = exampleComponent.files.find(
      (code) => code.decorator === 'component'
    );

    if (componentFile) {
      const componentTab = this.document.createElement(this.tabTagName);
      this.setAttribute(componentTab, 'label', 'Example');
      componentTab.appendChild(
        this.createComponentOutletElement(componentFile)
      );
      tabGroup.appendChild(componentTab);
    }

    for (const file of exampleComponent.files) {
      const tab = this.document.createElement(this.tabTagName);
      const pre = this.document.createElement('pre');
      this.setAttribute(tab, 'label', file.fileName);
      tab.appendChild(pre);
      pre.appendChild(this.createElementWithContent('code', file.content));
      tabGroup.appendChild(tab);
    }

    card.appendChild(tabGroup);
    exampleComponent.containerElement.insertBefore(card, reference);
    exampleComponent.containerElement.removeChild(reference);
  }

  private createComponentOutletElement(componentFile: File): HTMLElement {
    const element = this.document.createElement('ng-container');
    this.setAttribute(element, '*ngComponentOutlet', componentFile.className);
    return element;
  }

  private findExampleComponentPaths(): ExampleComponent[] {
    const commentNodes = Array.from(this.body.childNodes).filter(
      (node) => node.nodeType === 8
    );

    const exampleComponents: ExampleComponent[] = [];

    for (const commentNode of commentNodes) {
      const commentContent = commentNode.textContent?.trim();

      if (!commentContent) {
        continue;
      }

      const dirPath = join(this.context.featureDir, commentContent);

      if (!existsSync(dirPath) || !lstatSync(dirPath).isDirectory()) {
        continue;
      }

      const files: File[] = [];
      const fileNames = readdirSync(dirPath);

      for (const fileName of fileNames) {
        const filePath = join(dirPath, fileName);
        const content = readFileSync(filePath, 'utf-8');
        const astData = this.tsAstParser.parse(content);

        files.push(
          this.createFile({
            id: fileName,
            fileName,
            content,
            className: astData?.className,
            decorator: astData?.decorator,
          })
        );
      }

      exampleComponents.push({
        files,
        containerElement: this.body,
        referenceNode: commentNode,
      });
    }

    return exampleComponents;
  }
}
