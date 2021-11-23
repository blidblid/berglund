import { Type } from '@angular/core';
import { BergCheckboxMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createLabelInputs,
  createStatefulInputs,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToCheckboxGenerator(
  component: Type<BergCheckboxMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7, context: MixinGeneratorContext) => {
    if (schema.type !== 'boolean') {
      return null;
    }

    return {
      packageName,
      mixinComponent: {
        component,
        inputs: {
          ...createLabelInputs(schema, context),
          ...createStatefulInputs(schema, context),
        },
      },
    };
  };
}
