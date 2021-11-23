import { Interactive } from '@berglund/mixins';
import { MixinComponentSpec } from '../core';

export function getDisabledSpec(
  disabledElementSelector?: string
): MixinComponentSpec<Interactive> {
  return {
    givenInputs: {
      disabled: true,
    },
    thenDomChange: {
      thenAttribute: [
        (disabled) => expect(disabled).toBe(null),
        'disabled',
        disabledElementSelector,
      ],
    },
  };
}
