import { sync } from 'glob';
import { dirname, isAbsolute } from 'path';
import { join } from '../../../core';
import { ShowcaseConfig } from './../schemas/showcase/schema';

const cwd = process.cwd();

type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ValidatedShowcaseConfig
  extends RequiredBy<ShowcaseConfig, 'componentOut' | 'name'> {}

export interface FeaturePath {
  path: string;
  dir: string;
}

export function readFeatures(
  featureGlob: string,
  ignoreGlob?: string
): FeaturePath[] {
  return sync(featureGlob, {
    cwd: process.cwd(),
    ignore: ignoreGlob,
    absolute: true,
  }).map((path) => {
    return {
      path,
      dir: dirname(path),
    };
  });
}

export function validateConfig(
  config: ShowcaseConfig
): config is ValidatedShowcaseConfig {
  if (!config.componentOut && !config.appOut) {
    throw new Error(`Specify either --componentOut or --appOut`);
  }

  if (!config.name) {
    config.name = 'Untitled';
  }

  config.tsconfig = convertToAbsolutePath(config.tsconfig);
  config.appOut = convertToAbsolutePath(config.appOut);
  config.componentOut = convertToAbsolutePath(config.componentOut);

  return true;
}

function convertToAbsolutePath(path?: string): string | undefined {
  if (path === undefined || isAbsolute(path)) {
    return path;
  }

  return join(cwd, path);
}
