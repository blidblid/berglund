import { JSDOM } from 'jsdom';
import { Context } from '../../core/context';
import { DomBuilder } from '../../core/dom-builder';
import { Component } from '../../core/dom-builder-model';

export class ContainerDomBuilder extends DomBuilder {
  constructor(
    protected jsdom: JSDOM,
    private context: Context,
    private children: Component[]
  ) {
    super(jsdom);
    this.addContainerDom();
  }

  getDom(): JSDOM {
    return this.jsdom;
  }

  private addContainerDom(): void {
    if (!this.context.isRoot) {
      this.body.appendChild(this.createNavBarElement());
    }

    this.body.classList.add('berg-showcase');
    this.setAttribute(this.body, 'bergIntersection');
    this.body.appendChild(this.createRouterOutletElement());
  }

  private createNavBarElement(): HTMLElement {
    const navbar = this.document.createElement('nav');
    this.setAttribute(navbar, 'mat-tab-nav-bar');

    for (const showcaseComponent of [...this.children].reverse()) {
      const a = this.document.createElement('a');
      a.textContent = showcaseComponent.name;

      this.setAttribute(a, 'mat-tab-link');

      this.setAttribute(
        a,
        '(click)',
        `navigateToChild('${
          showcaseComponent.type === 'readme'
            ? `../${this.context.id}`
            : showcaseComponent.type
        }')`
      );

      this.setAttribute(
        a,
        '[active]',
        `routeIncludesType('${showcaseComponent.type}')`
      );

      navbar.appendChild(a);
    }

    return navbar;
  }

  private createRouterOutletElement(): HTMLElement {
    return this.document.createElement('router-outlet');
  }
}
