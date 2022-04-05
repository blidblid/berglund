import { JSDOM } from 'jsdom';
import { DomBuilder } from '../../core/dom-builder';
import { Cell } from '../../core/dom-builder-model';
import { ApiGroup, ApiNode, ApiPropertyItem } from './tsdoc-ast-parser-model';
import { isMethodItem, isPropertyItem } from './tsdoc-ast-parser-util';

export class ApiDomBuilder extends DomBuilder {
  constructor(protected jsdom: JSDOM, private apiGroups: ApiGroup[]) {
    super(jsdom);

    if (apiGroups.length === 0) {
      return;
    }

    for (const group of this.apiGroups) {
      this.appendApiTitle(group.title, 'h1');

      if (group.isCompact) {
        this.appendNameTable(group);
        continue;
      }

      for (const node of group.nodes) {
        this.appendApiTitle(node.name, 'h2', node.sourceUrl);

        if (node.selector) {
          this.appendCode(`selector: '${node.selector}'`);
        }

        if (node.description) {
          this.appendParagraph(node.description);
        }

        this.appendPropertyTable(node);
        this.appendMethodTable(node);
      }
    }

    this.addCommon();
  }

  getDom(): JSDOM | null {
    return this.apiGroups.length > 0 ? this.jsdom : null;
  }

  protected appendApiTitle(
    title: string,
    titleTag: string,
    sourceUrl?: string
  ): void {
    const titleElem = this.createElementWithContent(titleTag, title);

    if (sourceUrl) {
      const buttonElement = this.createIconButtonElement('code', 'a');
      this.setAttribute(buttonElement, 'href', sourceUrl);
      titleElem.appendChild(buttonElement);
    }

    this.appendTitle(titleElem);
  }

  private appendMethodTable(node: ApiNode): void {
    const methodApiItems = node.items?.filter(isMethodItem);

    if (!Array.isArray(methodApiItems) || methodApiItems.length === 0) {
      return;
    }

    this.appendTitle(this.createElementWithContent('h4', 'Methods'));

    this.appendTable(
      [
        { key: 'name', label: 'Name', isCode: true },
        { key: 'description', label: 'Description' },
      ],
      methodApiItems
    );
  }

  private appendPropertyTable(node: ApiNode): void {
    const propertyApiItems = node.items?.filter(isPropertyItem);

    if (!Array.isArray(propertyApiItems) || propertyApiItems.length === 0) {
      return;
    }

    this.appendTitle(this.createElementWithContent('h4', 'Properties'));

    const cells: Cell<ApiPropertyItem>[] = [
      { key: 'name', label: 'Name', isCode: true },
    ];

    if (this.isAngularNode(node)) {
      cells.unshift({ key: 'nodeType', label: 'Type', isCode: true });
    }

    cells.push({ key: 'description', label: 'Description' });

    this.appendTable(cells, propertyApiItems);
  }

  private appendNameTable(apiGroup: ApiGroup): void {
    const nodes = apiGroup.nodes;

    if (nodes.length === 0) {
      return;
    }

    this.appendTable(
      [
        { key: 'name', label: 'Name', isCode: true },
        { key: 'description', label: 'Description' },
      ],
      nodes
    );
  }

  private isAngularNode(node: ApiNode): boolean {
    return (
      node.type === 'Component' ||
      node.type === 'NgModule' ||
      node.type === 'Directive' ||
      node.type === 'Pipe'
    );
  }
}
