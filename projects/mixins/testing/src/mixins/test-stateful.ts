import { Stateful } from '@berglund/mixins';
import { MixinComponentSpec } from '../core';

export function getRequiredSpec(): MixinComponentSpec<Stateful> {
  return {
    givenInputs: {
      required: true,
    },
    thenDomChange: {
      thenAttribute: [(required) => expect(required).toBeTruthy(), 'required'],
    },
  };
}

export function getReadonlySpec(
  elementSelector: string
): MixinComponentSpec<Stateful> {
  return {
    givenInputs: {
      readonly: true,
    },
    thenDomChange: {
      thenSelector: [
        (readonly) => expect(readonly).toBeTruthy(),
        elementSelector,
      ],
    },
  };
}
