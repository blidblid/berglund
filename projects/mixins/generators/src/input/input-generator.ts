import { Type } from '@angular/core';
import { BergInputMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createLabelInputs,
  createStatefulInputs,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToInputGenerator(
  component: Type<BergInputMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7, context: MixinGeneratorContext) => {
    if (schema.type !== 'string' && schema.type !== 'number') {
      return null;
    }

    return {
      packageName,
      mixinComponent: {
        component,
        inputs: {
          type: schema.type === 'string' ? 'text' : 'number',
          ...createLabelInputs(schema, context),
          ...createStatefulInputs(schema, context),
        },
      },
    };
  };
}
