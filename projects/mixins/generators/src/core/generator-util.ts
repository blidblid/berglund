import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

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
