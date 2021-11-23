import { ViewContainerRef } from '@angular/core';
import { MixinComponentInputs } from '@berglund/mixins';

export interface TestWrapperComponent {
  viewContainerRef: ViewContainerRef;
}

export interface QueriesDomChange {
  thenSelector(
    expect: MixinComponentExpect<HTMLElement | null>,
    selector?: string
  ): QueriesDomChange;

  thenTextContent(
    expect: MixinComponentExpect<string | null>,
    selector?: string
  ): QueriesDomChange;

  thenAttribute(
    expect: MixinComponentExpect<string | null>,
    attribute: string,
    selector?: string
  ): QueriesDomChange;
}

export type ThenDomChange = Partial<
  {
    [P in keyof QueriesDomChange]: Parameters<QueriesDomChange[P]>;
  }
>;

export interface MixinComponentSpec<T> {
  givenInputs: MixinComponentInputs<T>;
  thenDomChange: ThenDomChange;
}

export type MixinComponentExpect<T> = (value: T) => boolean;
