import { ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  BergComponentBuilder,
  component,
  MixinComponentInputs,
} from '@berglund/mixins';
import {
  MixinComponentExpect,
  QueriesDomChange,
  TestWrapperComponent,
} from './mixin-component-tester-model';
import { MixinComponentTesterComponent } from './mixin-component-tester.component';

export class MixinComponentTester<T> implements QueriesDomChange {
  private fixture: ComponentFixture<MixinComponentTesterComponent>;
  private componentBuilder: BergComponentBuilder;
  private componentRef: ComponentRef<T>;

  private get hostElem(): HTMLElement {
    return this.componentRef.location.nativeElement;
  }

  private get componentInstance(): TestWrapperComponent {
    return this.fixture.componentInstance;
  }

  private get viewContainerRef(): ViewContainerRef {
    return this.componentInstance.viewContainerRef;
  }

  constructor(private component: Type<T>, private ngModules: any[]) {
    this.setupTestBed();
    this.createComponent();
  }

  withInputs(inputs: MixinComponentInputs<T>): MixinComponentTester<T> {
    this.createComponent(inputs);
    return this;
  }

  thenSelector(
    mixinExpect: MixinComponentExpect<HTMLElement | null>,
    selector?: string
  ): MixinComponentTester<T> {
    this.expectElement(mixinExpect, this.getElement(selector));
    return this;
  }

  thenAttribute(
    mixinExpect: MixinComponentExpect<string | null>,
    attribute: string,
    selector?: string
  ): MixinComponentTester<T> {
    const element = this.getElement(selector);

    if (
      this.expectElement((element) => expect(element).not.toBe(null), element)
    ) {
      mixinExpect(element.getAttribute(attribute));
    }

    return this;
  }

  thenTextContent(
    mixinExpect: MixinComponentExpect<string | null>,
    selector?: string
  ): MixinComponentTester<T> {
    const element = this.getElement(selector);

    if (
      this.expectElement((element) => expect(element).not.toBe(null), element)
    ) {
      mixinExpect(element.textContent?.trim() ?? null);
    }

    return this;
  }

  private expectElement(
    expect: MixinComponentExpect<HTMLElement | null>,
    element: HTMLElement | null
  ): element is HTMLElement {
    expect(element);
    return element !== null;
  }

  private getElement(selector?: string): HTMLElement | null {
    return selector ? this.hostElem.querySelector(selector) : this.hostElem;
  }

  private createComponent(inputs?: MixinComponentInputs<T>): void {
    this.viewContainerRef.clear();
    this.componentRef = this.componentBuilder.create(
      component({ component: this.component }, inputs),
      this.viewContainerRef
    );

    this.fixture.detectChanges();
  }

  private setupTestBed(): void {
    TestBed.configureTestingModule({
      declarations: [MixinComponentTesterComponent, this.component],
      imports: [
        ...this.ngModules,
        ...this.getBoilerplateModules(this.ngModules),
      ],
    }).compileComponents();

    this.fixture = TestBed.createComponent(MixinComponentTesterComponent);
    this.fixture.detectChanges();
    this.componentBuilder = TestBed.inject(BergComponentBuilder);
  }

  private getBoilerplateModules(ngModules: any[]): any[] {
    const boilerplateNgModules = [];

    if (!ngModules.includes(NoopAnimationsModule)) {
      boilerplateNgModules.push(BrowserAnimationsModule);
    }

    return boilerplateNgModules;
  }
}
