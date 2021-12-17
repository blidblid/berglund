import { JSONSchema7 } from 'json-schema';

export type SchemaToOptions<T extends JSONSchema7> =
  T['properties'] extends Record<string, JSONSchema7>
    ? SchemaRecordToOptions<T['properties']>
    : Record<keyof T['properties'], any>;

type SchemaToType<T extends JSONSchema7> = T['type'] extends 'boolean'
  ? boolean
  : T['type'] extends 'string'
  ? string
  : T['type'] extends 'number' | 'integer'
  ? number
  : T['type'] extends 'array'
  ? (T['items'] extends JSONSchema7 ? SchemaToType<T['items']> : any)[]
  : T['type'] extends 'object'
  ? T['properties'] extends JSONSchema7
    ? SchemaToType<T['properties']>
    : any
  : any;

type SchemaRecordToOptions<T extends Record<string, JSONSchema7>> = {
  [P in keyof T]: SchemaToType<T[P]>;
};
