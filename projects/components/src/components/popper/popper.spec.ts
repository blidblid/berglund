import { OverlayContainer } from '@angular/cdk/overlay';
import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { Component, Directive, ElementRef, ViewChild } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BergPopperDirective } from './popper.directive';
import { BergPopperModule } from './popper.module';

describe('BergPopper', () => {
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BergPopperTextTestComponent,
        BergPopperTemplateTestComponent,
        BergPopperComponentTestComponent,
        BergPopperComponentTestContentComponent,
      ],
      imports: [BergPopperModule],
    });

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
  });

  it('should show text content', fakeAsync(() => {
    const fixture = TestBed.createComponent(BergPopperTextTestComponent);
    fixture.detectChanges();

    const unitTestElement = new UnitTestElement(
      fixture.componentInstance.bergPopperElement,
      () => Promise.resolve()
    );

    unitTestElement.hover();
    expect(overlayContainerElement.textContent!.trim()).toBe(
      fixture.componentInstance.text
    );
  }));

  it('should show template content', fakeAsync(() => {
    const fixture = TestBed.createComponent(BergPopperTemplateTestComponent);
    fixture.detectChanges();

    const unitTestElement = new UnitTestElement(
      fixture.componentInstance.bergPopperElement,
      () => Promise.resolve()
    );

    unitTestElement.hover();
    tick();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      fixture.componentInstance.text
    );
  }));

  it('should show component content', fakeAsync(() => {
    const fixture = TestBed.createComponent(BergPopperComponentTestComponent);
    fixture.detectChanges();

    const unitTestElement = new UnitTestElement(
      fixture.componentInstance.bergPopperElement,
      () => Promise.resolve()
    );

    unitTestElement.hover();
    tick();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      new BergPopperComponentTestContentComponent().text
    );
  }));
});

@Directive()
export class BergPopperTestBase {
  @ViewChild(BergPopperDirective, { read: ElementRef })
  private bergPopperElementRef: ElementRef<HTMLElement>;

  get bergPopperElement() {
    return this.bergPopperElementRef.nativeElement;
  }
}

@Component({
  template: `<div
    [bergPopper]="text"
    bergPopperOpenTrigger="mouseenter"
  ></div>`,
})
export class BergPopperTextTestComponent extends BergPopperTestBase {
  text = 'flip';
}

@Component({
  template: `<div
      [bergPopper]="template"
      bergPopperOpenTrigger="mouseenter"
    ></div>

    <ng-template #template>{{ text }}</ng-template> `,
})
export class BergPopperTemplateTestComponent extends BergPopperTestBase {
  text = 'oh flip';
}

@Component({
  template: `<div
    [bergPopper]="component"
    bergPopperOpenTrigger="mouseenter"
  ></div>`,
})
export class BergPopperComponentTestComponent extends BergPopperTestBase {
  component = BergPopperComponentTestContentComponent;
}

@Component({
  template: `{{ text }}`,
})
export class BergPopperComponentTestContentComponent {
  text = 'oh flop';
}
