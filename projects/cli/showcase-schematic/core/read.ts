import { existsSync, readFileSync } from 'fs';
import { sync } from 'glob';
import { dirname, isAbsolute } from 'path';
import { join, resolve } from '../../../core';
import { ConfigFile } from './read-model';

type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

const cwd = process.cwd();

export interface FeaturePath {
  path: string;
  dir: string;
}

export function readFeatures(showcaseDir: string, featureGlob: string, ignoreGlob?: string): FeaturePath[] {
  return sync(featureGlob, {
    cwd: showcaseDir,
    ignore: ignoreGlob,
    absolute: true,
  }).map(path => {
    return {
      path,
      dir: dirname(path),
    };
  });
}

export function readConfigs<T>(configFileName: string): ConfigFile<T>[] {
  const parentConfig = readParentConfig<T>(configFileName);
  return parentConfig ? [parentConfig] : readChildConfigs(configFileName);
}

export function readParentConfig<T>(configFileName: string): ConfigFile<T> | null {
  let path = cwd;

  while (existsSync(path)) {
    const configPath = join(path, configFileName);

    if (existsSync(configPath)) {
      return {
        content: JSON.parse(readFileSync(configPath, 'utf-8')) as T,
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

function readChildConfigs<T>(configFileName: string): ConfigFile<T>[] {
  return sync([cwd, '**', configFileName].join('/'), {
    ignore: '**/node_modules',
  }).map(path => {
    return {
      content: JSON.parse(readFileSync(path, 'utf-8')) as T,
      dir: dirname(path),
    };
  });
}

function convertToAbsolutePath(dir: string, path: string): string {
  if (isAbsolute(path)) {
    return path;
  }

  return join(dir, path);
}
