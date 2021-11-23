import { JSDOM } from 'jsdom';
import { parse } from 'path';
import { join } from '../../../core/path';
import { toRelativePath } from '../../../core/util';
import { Cell, DomData, File, RenderedCell } from './dom-builder-model';

export abstract class DomBuilder {
  protected idSet = new Set<string>();
  protected document = this.jsdom.window.document;
  protected body = this.document.body;

  protected cardTagName = 'mat-card';
  protected tabTagName = 'mat-tab';
  protected tabGroupTagName = 'mat-tab-group';
  protected listGroupTagName = 'mat-nav-list';
  protected listItemTagName = 'mat-list-item';

  protected relativeContainer = this.document.createElement('div');
  protected flexContainer = this.document.createElement('div');
  protected left = this.document.createElement('div');
  protected right = this.document.createElement('div');

  abstract getDom(): JSDOM | null;

  constructor(protected jsdom: JSDOM) {
    this.cleanJsdom(this.body);
  }

  getTitles(): HTMLElement[] {
    return Array.from(
      this.document.querySelectorAll<HTMLElement>('h1, h2, h3, h4')
    );
  }

  getTitleIds(): string[] {
    return this.getTitles()
      .map((title) => title.getAttribute('id'))
      .filter((id): id is string => id !== null);
  }

  getDomData(): DomData {
    return {
      titleIds: this.getTitleIds(),
    };
  }

  createFile(
    partialFile: Omit<
      File,
      'extension' | 'fileNameWithoutExtension' | 'relativePath' | 'localPath'
    >
  ): File {
    const parsedFileName = parse(partialFile.fileName);
    const fileNameWithoutExtension = parsedFileName.name;
    return {
      ...partialFile,
      fileNameWithoutExtension,
      extension: parsedFileName.ext,
      relativePath: toRelativePath(
        join(partialFile.id, fileNameWithoutExtension)
      ),
      localPath: toRelativePath(fileNameWithoutExtension),
    };
  }

  protected addCommon(): void {
    const addLayout = () => {
      this.flexContainer.classList.add('berg-showcase-flex-container');

      this.left.classList.add('berg-showcase-left');
      this.right.classList.add('berg-showcase-right');

      for (const title of this.getTitles()) {
        title.classList.add('berg-showcase-title');
      }

      while (this.body.firstChild) {
        this.left.appendChild(this.body.firstChild);
      }

      this.flexContainer.appendChild(this.left);
      this.flexContainer.appendChild(this.right);
      this.relativeContainer.appendChild(this.flexContainer);
      this.body.appendChild(this.relativeContainer);
    };

    const addTableOfContents = () => {
      const tocLevels = {
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
      };

      const listGroup = this.document.createElement(this.listGroupTagName);
      listGroup.classList.add('berg-showcase-table-of-contents');

      for (const title of this.getTitles()) {
        const id = title.getAttribute('id')!;
        const item = this.document.createElement(this.listItemTagName);
        item.classList.add(
          `berg-showcase-table-of-contents-level-${tocLevels[title.tagName]}`
        );
        item.textContent = title.childNodes[0].textContent;
        this.setAttribute(
          item,
          '(click)',
          `updateLocationWithId('${id}', true)`
        );
        this.setAttribute(
          item,
          '[class.berg-showcase-active-item]',
          `isActiveRoute('${id}')`
        );
        listGroup.appendChild(item);
      }

      this.right.appendChild(listGroup);
    };

    const addLinkButtons = () => {
      for (const title of this.getTitles()) {
        const id = title.getAttribute('id')!;
        const buttonElement = this.createIconButtonElement('link');
        this.setAttribute(
          buttonElement,
          '(click)',
          `updateLocationWithId('${id}')`
        );
        title.appendChild(buttonElement);
      }
    };

    const addIntersectionObserverNodes = () => {
      for (const title of this.getTitles()) {
        const id = title.getAttribute('id')!;
        this.setAttribute(title, 'bergIntersectionNode');
        this.setAttribute(
          title,
          '(bergIntersectionNodeChange)',
          `onIntersectionChanged($event, '${id}')`
        );
      }
    };

    const addRouterLinks = () => {
      const links = Array.from(
        this.document.querySelectorAll<HTMLElement>('a')
      );

      for (const link of links) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('./')) {
          this.setAttribute(link, 'routerLink', href.substr(1));
        }
      }
    };

    const addHighlighting = () => {
      for (const element of Array.from(
        this.body.querySelectorAll('pre > code')
      )) {
        this.setAttribute(element as HTMLElement, 'highlightCode');
      }
    };

    addTableOfContents();
    addIntersectionObserverNodes();
    addLayout();
    addRouterLinks();
    addLinkButtons();
    addHighlighting();
  }

  protected setAttribute(
    element: HTMLElement,
    attribute: string,
    value = ''
  ): void {
    element.setAttributeNS(null, attribute, value);
  }

  protected appendCode(code: string): void {
    this.body.appendChild(
      this.createElementWithContent(
        'p',
        this.createElementWithContent('code', code)
      )
    );
  }

  protected appendTitle(titleElem: HTMLElement): HTMLElement {
    let id = titleElem.childNodes[0].textContent ?? '';
    let titleIdCounter = 1;

    while (this.idSet.has(id)) {
      id = `${id}-${titleIdCounter++}`;
    }

    this.idSet.add(id);

    titleElem.setAttribute('id', id);
    this.body.appendChild(titleElem);

    return titleElem;
  }

  protected appendParagraph(paragraph: string): void {
    this.body.appendChild(this.createElementWithContent('p', paragraph));
  }

  protected appendTable<T>(cells: Cell<T>[], items: T[]): void {
    if (items.length === 0) {
      return;
    }

    cells = cells.filter((cell) => items.some((item) => !!item[cell.key]));

    if (cells.length === 0) {
      return;
    }

    const [tableElement, tableHeadElement, tableBodyElement] =
      this.createTableElement();

    const renderedHeaderCells: RenderedCell[] = cells.map((cell) => {
      return {
        content: cell.label,
      };
    });

    tableHeadElement.appendChild(
      this.createRowElement(renderedHeaderCells, 'th')
    );

    for (const item of items) {
      const renderedRowCells: RenderedCell[] = cells.map((cell) => {
        return {
          content: item[cell.key],
          isCode: cell.isCode,
        };
      });

      tableBodyElement.appendChild(this.createRowElement(renderedRowCells));
    }

    this.body.appendChild(tableElement);
  }

  protected createElementWithContent(
    tagName: string,
    content: string | null | HTMLElement = null
  ): HTMLElement {
    const element = this.document.createElement(tagName);

    if (typeof content === 'string' || content === null) {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }

    return element;
  }

  protected createIconButtonElement(
    iconName: string,
    tagName: 'a' | 'button' = 'button'
  ): HTMLElement {
    const button = this.document.createElement(tagName);
    button.classList.add('berg-showcase-icon-button');
    this.setAttribute(button, 'mat-icon-button', '');

    const icon = this.document.createElement('mat-icon');
    icon.textContent = iconName;
    button.appendChild(icon);

    return button;
  }

  protected createTableElement(): [HTMLElement, HTMLElement, HTMLElement] {
    const tableElement = this.document.createElement('table');
    const tableHeadElement = this.document.createElement('thead');
    const tableBodyElement = this.document.createElement('tbody');
    tableElement.appendChild(tableHeadElement);
    tableElement.appendChild(tableBodyElement);
    return [tableElement, tableHeadElement, tableBodyElement];
  }

  protected createRowElement(
    renderedCells: RenderedCell[],
    cellType: 'td' | 'th' = 'td'
  ): HTMLElement {
    const rowElement = this.document.createElement('tr');

    for (const cell of renderedCells) {
      const cellElement = this.document.createElement(cellType);

      let element: HTMLElement;
      const contents = Array.isArray(cell.content)
        ? cell.content
        : [cell.content];

      for (const content of contents) {
        if (cell.isCode) {
          element = this.document.createElement('code');
          element.classList.add('language-typescript');
          this.setAttribute(element, 'highlightCode');
        } else {
          element = this.document.createElement('div');
        }

        element.textContent = content;
        cellElement.appendChild(element);
      }

      rowElement.appendChild(cellElement);
    }

    return rowElement;
  }

  protected cleanJsdom(body: HTMLElement): void {
    const html = this.jsdom.window.document.querySelector('html')!;
    this.jsdom.window.document.removeChild(html);
    this.jsdom.window.document.appendChild(body);
  }
}
