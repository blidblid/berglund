import { JSONSchema7 } from 'json-schema';

export interface ResolvedSchema {
  schema: JSONSchema7;
  path: string;
  generatedTs?: string;
  generatedSchema?: JSONSchema7;
}
