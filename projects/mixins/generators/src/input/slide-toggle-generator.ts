import { Type } from '@angular/core';
import { BergSlideToggleMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createStatefulInputs,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToSlideToggleGenerator(
  component: Type<BergSlideToggleMixinBase>,
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
          ...createStatefulInputs(schema, context),
        },
      },
    };
  };
}
