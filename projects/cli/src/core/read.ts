import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

export function readConfig<T>(fileName: string): Partial<T> {
  let path = process.cwd();

  while (existsSync(path)) {
    const configFileName = join(path, fileName);

    if (existsSync(configFileName)) {
      return JSON.parse(readFileSync(configFileName, 'utf-8'));
    }

    const newPath = resolve(path, '..');

    if (newPath === path) {
      break;
    }

    path = newPath;
  }

  return {};
}
