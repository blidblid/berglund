import { existsSync, readFileSync } from 'fs';
import { sync } from 'glob';
import { dirname, join, resolve } from 'path';
import { ConfigFile } from './read-model';

const cwd = process.cwd();

export function readConfigs<T>(configFileName: string): ConfigFile<T>[] {
  const parentConfig = readParentConfig<T>(configFileName);
  return parentConfig ? [parentConfig] : readChildConfigs(configFileName);
}

export function readParentConfig<T>(
  configFileName: string
): ConfigFile<T> | null {
  let path = cwd;

  while (existsSync(path)) {
    const configPath = join(path, configFileName);

    if (existsSync(configPath)) {
      return {
        content: JSON.parse(readFileSync(configPath, 'utf-8')),
        dir: path,
      };
    }

    const newPath = resolve(path, '..');

    if (newPath === path) {
      break;
    }

    path = newPath;
  }

  return null;
}

function readChildConfigs(configFileName: string): any[] {
  return sync([cwd, '**', configFileName].join('/'), {
    ignore: '**/node_modules',
  }).map((path) => {
    return {
      content: JSON.parse(readFileSync(path, 'utf-8')),
      dir: dirname(path),
    };
  });
}
