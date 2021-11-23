import { JSDOM } from 'jsdom';
import { TsAstParser } from '../../../../core';
import { DomBuilder } from '../../core/dom-builder';
import { DomFile, ExampleComponent, File } from '../../core/dom-builder-model';
import { CodeElementToFileMapper } from './readme-dom-model';

export class ReadmeDomBuilder extends DomBuilder {
  private mappers: CodeElementToFileMapper[] = [
    {
      cssClassName: 'language-typescript',
      commentPrefix: '//',
      commentSuffix: '\n',
    },
    {
      cssClassName: 'language-html',
      commentPrefix: '<!--',
      commentSuffix: '-->',
    },
    {
      cssClassName: 'language-scss',
      commentPrefix: '//',
      commentSuffix: '\n',
    },
    {
      cssClassName: 'language-css',
      commentPrefix: '//',
      commentSuffix: '\n',
    },
  ];

  private exampleComponents = this.createExampleComponents();

  constructor(protected jsdom: JSDOM, private tsAstParser: TsAstParser) {
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
      exampleComponent.files[0].preElement
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
      this.setAttribute(tab, 'label', file.fileName);
      tab.appendChild(file.preElement);
      tabGroup.appendChild(tab);
    }

    card.appendChild(tabGroup);
    exampleComponent.containerElement.insertBefore(card, reference);
    exampleComponent.containerElement.removeChild(reference);
  }

  private createComponentOutletElement(componentFile: File): HTMLElement {
    const element = this.document.createElement('ng-container');
    this.setAttribute(element, '*ngComponentOutlet', componentFile.className!);
    return element;
  }

  private createExampleComponents(): ExampleComponent[] {
    const codeElements = this.document.querySelectorAll('code');
    const files = Array.from(codeElements)
      .map((codeElement) => this.extractFileFromCodeElement(codeElement))
      .filter((file): file is DomFile => !!file);

    const showcaseComponents: ExampleComponent[] = [];

    while (files.length) {
      const head = files.pop()!;
      const showcaseComponent: ExampleComponent = {
        id: head.id,
        files: [head],
        containerElement: head.preElement.parentElement!,
      };

      for (const file of [...files]) {
        if (file.id === showcaseComponent.id) {
          showcaseComponent.files.push(files.splice(files.indexOf(file), 1)[0]);
        }
      }

      showcaseComponents.push(showcaseComponent);
    }

    return showcaseComponents;
  }

  private extractFileFromCodeElement(codeElement: HTMLElement): DomFile | null {
    const code = codeElement.textContent?.trim();

    if (!code) {
      return null;
    }

    for (const mapper of this.mappers) {
      if (codeElement.classList.contains(mapper.cssClassName)) {
        if (!code.startsWith(mapper.commentPrefix)) {
          return null;
        }

        const match = code.match(
          new RegExp(`^${mapper.commentPrefix}(.+)${mapper.commentSuffix}`)
        );

        if (!match) {
          return null;
        }

        const fileName = match[1].trim();
        const id = fileName.split('.')[0];
        const content = code.replace(match[0], '').trim();
        const astData = this.tsAstParser.parse(content);

        return {
          codeElement,
          preElement: codeElement.parentElement as HTMLPreElement,
          ...this.createFile({
            id,
            fileName,
            content,
            className: astData?.className,
            decorator: astData?.decorator,
          }),
        };
      }
    }

    return null;
  }
}
