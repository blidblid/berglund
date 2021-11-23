import { Type } from '@angular/core';
import { BergCalendarMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import {
  createStatefulInputs,
  MixinComponentGenerator,
  MixinGeneratorContext,
} from '../core';

export function createJsonSchemaToCalendarGenerator(
  component: Type<BergCalendarMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7, context: MixinGeneratorContext) => {
    if (schema.type !== 'string' || schema.format !== 'date') {
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
