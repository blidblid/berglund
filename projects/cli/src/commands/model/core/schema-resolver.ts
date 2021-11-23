import { readFileSync } from 'fs';
import { sync } from 'glob';
import { JSONSchema7 } from 'json-schema';
import { parse } from 'path';
import {
  FetchingJSONSchemaStore,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  quicktype,
} from 'quicktype-core';
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema';
import { isNotNullOrUndefined, readJsonObject } from '../../../core/util';
import { Context } from './context';
import { ResolvedSchema } from './schema-resolver-model';

export class SchemaResolver {
  constructor(private context: Context) {}

  async getSchemas(): Promise<ResolvedSchema[]> {
    const result: ResolvedSchema[] = [];
    const modelPaths = sync(this.context.config.modelGlob, {
      ignore: this.context.config.modelIgnoreGlob,
    });

    for (const modelPath of modelPaths) {
      const { ext } = parse(modelPath);

      if (ext === '.ts') {
        const schema = this.tsToJsonSchema(modelPath);
        if (isNotNullOrUndefined(schema)) {
          result.push({ schema, path: modelPath, generatedSchema: schema });
        }
      } else if (ext === '.json') {
        const schema = await this.jsonToJsonSchema(modelPath);
        const ts = await this.jsonSchemaToTs(schema);

        result.push({
          schema: await this.jsonToJsonSchema(modelPath),
          generatedTs: ts,
          path: modelPath,
        });
      } else {
        throw new Error(`Could not create JSON schema from ${modelPath}.`);
      }
    }

    return result;
  }

  private tsToJsonSchema(path: string): JSONSchema7 | null {
    const program = getProgramFromFiles([path]);
    return generateSchema(program, '*') as JSONSchema7 | null;
  }

  private async jsonSchemaToTs(schema: JSONSchema7): Promise<string> {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());

    await schemaInput.addSource({
      name: 'typeName',
      schema: JSON.stringify(schema),
    });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    return (
      await quicktype({
        inputData,
        lang: 'ts',
      })
    ).lines.join('\n');
  }

  private async jsonToJsonSchema(path: string): Promise<JSONSchema7> {
    const json = readJsonObject(path);
    if ('$schema' in json) {
      return json;
    }

    const { name } = parse(path);
    const content = readFileSync(path, 'utf-8');
    const input = jsonInputForTargetLanguage('json-schema');

    await input.addSource({
      name,
      samples: [content],
    });

    const inputData = new InputData();
    inputData.addInput(input);

    return JSON.parse(
      (
        await quicktype({
          inputData,
          lang: 'schema',
        })
      ).lines.join('\n')
    );
  }
}
