import '@angular/compiler';
import { writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { basename, dirname } from 'path';
import yargs from 'yargs';
import { fileNames, join, readConfig } from '../../core';
import {
  Context,
  GeneratorResolver,
  SchemaResolver,
  TsModelAstPrinter,
} from './core';
import { ModelConfig } from './schemas/schema';
import schema from './schemas/schema.json';

export const MODEL_COMMAND: yargs.CommandModule = {
  command: 'model',
  describe: 'Generates model components.',
  builder: (yargs: yargs.Argv) => {
    for (const [key, value] of Object.entries(schema.properties)) {
      yargs.option(key, {
        demandOption: schema.required.includes(key),
        describe: value['description'],
        default: value['default'],
      });
    }

    return yargs;
  },
  handler,
};

async function handler(args: yargs.Arguments<ModelConfig>) {
  const context = new Context({
    ...args,
    ...readConfig(fileNames.modelConfig),
  });

  const schemaResolver = new SchemaResolver(context);
  const generatorResolver = new GeneratorResolver(context);
  const printer = new TsModelAstPrinter();
  const generators = generatorResolver.getGenerators();
  const schemas = await schemaResolver.getSchemas();

  if (context.config.out) {
    ensureDirSync(dirname(context.config.out));
  }

  for (const schema of schemas) {
    const component = await printer.printComponents(schema, generators);
    const name = basename(schema.path).split('.')[0];
    const outDir = context.config.out ?? dirname(schema.path);

    ensureDirSync(outDir);
    writeFileSync(join(outDir, `${name}-components.ts`), component);

    if (!context.config.generateModel) {
      continue;
    }

    if (schema.generatedSchema) {
      writeFileSync(
        join(outDir, `${name}.json`),
        JSON.stringify(schema.generatedSchema, null, 2)
      );
    }

    if (schema.generatedTs) {
      writeFileSync(join(outDir, `${name}.ts`), schema.generatedTs);
    }
  }
}
