import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';
import { JSONSchema7 } from 'json-schema';
import { basename, dirname, join } from 'path';
import { resolveHooks } from '../src/core/context';
import { BUILDER_DIR_NAMES } from '../src/model/builder-model-private';

const buildAngularPath = dirname(
  dirname(require.resolve('@angular-devkit/build-angular'))
);

(function generate() {
  generateBuildersJson();
  generateSchemaJson();
})();

function generateBuildersJson(): void {
  const buildersJsonPath = join(buildAngularPath, 'builders.json');
  writeFileSync('./builders.json', readFileSync(buildersJsonPath, 'utf8'));
}

function generateSchemaJson(): void {
  const nodeModulesDirname = process.cwd().split('node_modules')[0];
  const hooks = resolveHooks(nodeModulesDirname);
  const schemaPaths = sync(
    join(buildAngularPath, 'src', 'builders', '**', 'schema.json')
  );

  for (const schemaPath of schemaPaths) {
    const nativeSchema: JSONSchema7 = JSON.parse(
      readFileSync(schemaPath, 'utf8')
    );

    const additionalSchema: JSONSchema7 =
      hooks.find((hook) => {
        return BUILDER_DIR_NAMES[hook.name] === basename(dirname(schemaPath));
      })?.schema ?? {};

    const mergedSchema = {
      ...nativeSchema,
      ...additionalSchema,
      properties: {
        ...nativeSchema.properties,
        ...additionalSchema.properties,
      },
    };

    writeFileSync(
      join(process.cwd(), schemaPath.split('build-angular')[1]),
      JSON.stringify(mergedSchema, null, 2)
    );
  }
}
