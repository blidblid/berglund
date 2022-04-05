import { existsSync, lstatSync } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import { File } from '../../../../core';
import { Context } from '../../core/context';
import { DomBuilder } from '../../core/dom-builder';
import { ExampleComponent } from '../../core/dom-builder-model';
import { ExampleDomBuilder } from '../../core/example-dom-builder';

export class ReadmeDomBuilder extends DomBuilder {
  private exampleComponents = this.findExampleComponents();

  constructor(protected jsdom: JSDOM, private context: Context, private exampleDomBuilder: ExampleDomBuilder) {
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

    this.setAttribute(tabGroup, '[disablePagination]', 'false');

    if (exampleComponent.referenceNode) {
      exampleComponent.containerElement.insertBefore(reference, exampleComponent.referenceNode);
    }

    const componentFile = exampleComponent.files.find(code => code.decorator === 'component');

    if (componentFile) {
      const componentTab = this.document.createElement(this.tabTagName);
      this.setAttribute(componentTab, 'label', 'Example');
      componentTab.appendChild(this.createComponentOutletElement(componentFile));

      tabGroup.appendChild(componentTab);
    }

    for (const file of exampleComponent.files) {
      const tab = this.document.createElement(this.tabTagName);
      const pre = this.document.createElement('pre');
      const code = this.createElementWithContent('code', file.content);
      code.classList.add(`language-${file.extensionName}`);
      this.setAttribute(tab, 'label', file.fileName);
      tab.appendChild(pre);
      pre.appendChild(code);
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

  private findExampleComponents(): ExampleComponent[] {
    const commentNodes = Array.from(this.body.childNodes).filter(node => node.nodeType === 8);
    const exampleComponents: ExampleComponent[] = [];

    for (const commentNode of commentNodes) {
      const commentContent = commentNode.textContent?.trim();

      if (!commentContent) {
        continue;
      }

      const dirPath = join(this.context.featureDir, commentContent);

      if (existsSync(dirPath) && lstatSync(dirPath).isDirectory()) {
        exampleComponents.push({
          referenceNode: commentNode,
          containerElement: this.body,
          files: this.exampleDomBuilder.createExampleFiles(dirPath),
        });
      }
    }

    return exampleComponents;
  }
}
