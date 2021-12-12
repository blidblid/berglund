import { Collection } from '@berglund/mixins';
import { MixinComponentSpec } from '../core';

const DATA = [
  { id: 'f', name: 'Fire' },
  { id: 'w', name: 'Water' },
  { id: 'e', name: 'Earth' },
];

export function getDataSpec(
  dataElementSelector: string
): MixinComponentSpec<Collection> {
  return {
    givenInputs: {
      data: DATA,
    },
    thenDomChange: {
      thenAllSelector: [
        (elements) => expect(elements.length).toBe(DATA.length),
        dataElementSelector,
      ],
    },
  };
}

export function getPluckLabelSpec(
  dataElementSelector: string
): MixinComponentSpec<Collection> {
  return {
    givenInputs: {
      data: DATA,
      pluckLabel: (element) => element.name,
    },
    thenDomChange: {
      thenTextContent: [
        (textContent) => expect(textContent).toBe(DATA[0].name),
        dataElementSelector,
      ],
    },
  };
}
