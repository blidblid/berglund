import { JSDOM } from 'jsdom';
import { File } from '../../../../core';
import { DomBuilder } from '../../core/dom-builder';
import { ExampleComponent } from '../../core/dom-builder-model';

export class EditorDomBuilder extends DomBuilder {
  constructor(protected jsdom: JSDOM) {
    super(jsdom);
    this.addCommon();
  }

  getDom(): JSDOM | null {
    return this.jsdom;
  }

  insertEditorComponent(exampleComponent: ExampleComponent): void {
    if (exampleComponent.files.length === 0) {
      return;
    }

    const componentFile = exampleComponent.files.find(file => file.decorator === 'component');

    if (!componentFile) {
      return;
    }

    const componentEditorElement = this.createComponentEditorElement(componentFile);
    exampleComponent.containerElement.appendChild(componentEditorElement);
  }

  private createComponentEditorElement(componentFile: File): HTMLElement {
    const element = this.document.createElement('at-component-editor');
    this.setAttribute(element, '[editor]', componentFile.className);
    return element;
  }
}
