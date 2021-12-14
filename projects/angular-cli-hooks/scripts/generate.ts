import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';
import { compileFromFile } from 'json-schema-to-typescript';
import { dirname, join } from 'path';

const buildAngularPath = dirname(
  dirname(require.resolve('@angular-devkit/build-angular'))
);

(async function generate() {
  await generateSchemaModels();
  generateBuildersJson();
  generateSchemaJson();
})();

async function generateSchemaModels() {
  const path = './schema.json';
  writeFileSync(path.replace('.json', '.ts'), await compileFromFile(path));
}

function generateBuildersJson(): void {
  const buildersJsonPath = join(buildAngularPath, 'builders.json');
  writeFileSync('./builders.json', readFileSync(buildersJsonPath, 'utf8'));
}

function generateSchemaJson(): void {
  for (const schemaPath of sync(
    join(buildAngularPath, 'src', 'builders', '**', 'schema.json')
  )) {
    writeFileSync(
      `.${schemaPath.split('build-angular')[1]}`,
      readFileSync(schemaPath, 'utf8')
    );
  }
}
