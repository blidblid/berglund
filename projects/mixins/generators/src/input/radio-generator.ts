import { Type } from '@angular/core';
import { BergRadioMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createSelectionInputs,
  createStatefulInputs,
  isSelectionSchema,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToRadioGenerator(
  component: Type<BergRadioMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7, context: MixinGeneratorContext) => {
    if (!isSelectionSchema(schema)) {
      return null;
    }

    return {
      packageName,
      mixinComponent: {
        component,
        inputs: {
          ...createStatefulInputs(schema, context),
          ...createSelectionInputs(schema),
        },
      },
    };
  };
}
