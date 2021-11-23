import { Label } from '@berglund/mixins';
import { MixinComponentSpec } from '../core';

export function getLabelSpec(
  labelElementSelector?: string
): MixinComponentSpec<Label> {
  return {
    givenInputs: {
      label: 'I am label',
    },
    thenDomChange: {
      thenTextContent: [
        (textContent) => expect(textContent).toBe('I am label'),
        labelElementSelector,
      ],
    },
  };
}

export function getHintSpec(
  hintElementSelector?: string
): MixinComponentSpec<Label> {
  return {
    givenInputs: {
      hint: 'I am hint',
    },
    thenDomChange: {
      thenTextContent: [
        (hint) => expect(hint).toBe('I am hint'),
        hintElementSelector,
      ],
    },
  };
}

export function getPlaceholderSpec(
  placeholderElementSelector?: string,
  placeholderAttribute = 'placeholder'
): MixinComponentSpec<Label> {
  return {
    givenInputs: {
      placeholder: 'I am placeholder',
    },
    thenDomChange: {
      thenAttribute: [
        (attribute) => expect(attribute).toBe('I am placeholder'),
        placeholderAttribute,
        placeholderElementSelector,
      ],
    },
  };
}

export function getAriaLabelSpec(
  ariaLabelElementSelector?: string,
  ariaLabelAttribute = 'placeholder'
): MixinComponentSpec<Label> {
  return {
    givenInputs: {
      hint: 'I am aria label',
    },
    thenDomChange: {
      thenAttribute: [
        (attribute) => expect(attribute).toBe('I am aria label'),
        ariaLabelAttribute,
        ariaLabelElementSelector,
      ],
    },
  };
}

export function getAriaLabelledbySpec(
  ariaLabelledbyElementSelector?: string,
  ariaLabelledbyAttribute = 'aria-labelledby'
): MixinComponentSpec<Label> {
  return {
    givenInputs: {
      hint: 'I am aria labelledby',
    },
    thenDomChange: {
      thenAttribute: [
        (attribute) => expect(attribute).toBe('I am aria labelledby'),
        ariaLabelledbyAttribute,
        ariaLabelledbyElementSelector,
      ],
    },
  };
}
