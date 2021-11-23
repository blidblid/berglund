import { Type } from '@angular/core';
import { BergTableMixinBase } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import { MixinComponentGenerator, prettyPrintKey } from '../core';

export function createJsonSchemaToTableGenerator(
  component: Type<BergTableMixinBase>,
  packageName: string
): MixinComponentGenerator {
  return (schema: JSONSchema7) => {
    if (schema.type !== 'object' || !schema.properties) {
      return null;
    }

    return {
      packageName,
      mixinComponent: {
        component,
        inputs: {
          columns: Object.keys(schema.properties).map((key) => {
            return {
              key,
              label: prettyPrintKey(key),
            };
          }),
        },
      },
    };
  };
}
