import { Type } from '@angular/core';
import { BergTextareaMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createLabelInputs,
  createStatefulInputs,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToTextareaGenerator(
  component: Type<BergTextareaMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7, context: MixinGeneratorContext) => {
    if (schema.type !== 'string') {
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
