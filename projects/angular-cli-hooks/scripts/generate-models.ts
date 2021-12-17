import { writeFileSync } from 'fs';
import { compileFromFile } from 'json-schema-to-typescript';

void (async function generate() {
  await generateSchemaModels();
})();

async function generateSchemaModels() {
  const path = './schema.json';
  writeFileSync(path.replace('.json', '.ts'), await compileFromFile(path));
}
