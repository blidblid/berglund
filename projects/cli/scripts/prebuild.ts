import { writeFileSync } from 'fs';
import { sync } from 'glob';
import { compileFromFile } from 'json-schema-to-typescript';
import { resolve } from 'path';

void (async function generate() {
  for (const path of sync('**/**/schema.json', {
    cwd: resolve('./src'),
    absolute: true,
  })) {
    writeFileSync(path.replace('.json', '.ts'), await compileFromFile(path));
  }
})();
