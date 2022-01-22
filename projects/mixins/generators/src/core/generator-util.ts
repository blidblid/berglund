import { FormControl } from '@angular/forms';
import { mergeValidationErrors } from '@berglund/mixins';
import { mergeWith } from '@berglund/rx';
import { component } from 'dist/mixins/core';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { map, share } from 'rxjs/operators';
import { GeneratedForm, GeneratedFormItem } from './generated-form';
import { MixinComponentGenerator } from './generator-model';

export function prettyPrintKey(key: string): string {
  return [...key]
    .map((letter, index) => {
      const isDivider =
        index > 0 &&
        (letter.toUpperCase() === letter || letter === '-' || letter === '_');

      return `${isDivider ? ' ' : ''}${
        index === 0 ? letter.toUpperCase() : letter.toLowerCase()
      }`;
    })
    .join('');
}

export function isJsonSchema(
  jsonSchemaDefinition: JSONSchema7Definition
): jsonSchemaDefinition is JSONSchema7 {
  return typeof jsonSchemaDefinition !== 'boolean';
}

export function isSelectionSchema(jsonSchema: JSONSchema7): boolean {
  return jsonSchema.items !== undefined || jsonSchema.enum !== undefined;
}

export function isRequiredSchema(
  jsonSchema: JSONSchema7,
  key: string
): boolean {
  return (
    jsonSchema &&
    Array.isArray(jsonSchema.required) &&
    jsonSchema.required.includes(key)
  );
}

export function generateForm(
  schema: JSONSchema7,
  generators: MixinComponentGenerator[]
): GeneratedForm {
  const entries = Object.entries(
    typeof schema.properties === 'object' ? schema.properties : {}
  );

  const items: GeneratedFormItem[] = [];

  for (const [key, value] of entries) {
    for (const generator of generators) {
      if (typeof value === 'boolean') {
        continue;
      }

      const generatedComponent = generator(value, { key });

      if (generatedComponent) {
        const formControl = new FormControl();
        const error$ = formControl.statusChanges.pipe(
          map(() => formControl.errors)
        );

        items.push({
          key,
          error$,
          value$: formControl.valueChanges,
          formControl,
          isValid$: error$.pipe(map((error) => error !== null)),
          component: component(generatedComponent.mixinComponent, {
            formControl,
          }),
        });

        break;
      }
    }
  }

  const value$ = mergeWith(
    (values) =>
      values.reduce(
        (acc, curr) => ({
          ...acc,
          ...curr,
        }),
        {}
      ),
    ...items.map((item) => item.value$)
  );

  const error$ = mergeWith(
    mergeValidationErrors,
    ...items.map((item) => item.error$)
  ).pipe(share());

  return {
    items,
    value$,
    error$,
    isValid$: error$.pipe(map((error) => error === null)),
  };
}
