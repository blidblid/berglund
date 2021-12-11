import { sync } from 'glob';
import { dirname, isAbsolute } from 'path';
import { join } from '../../../core';
import { ShowcaseConfig } from './../schemas/showcase/schema';

type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ValidatedShowcaseConfig
  extends RequiredBy<ShowcaseConfig, 'componentOut' | 'name' | 'tsconfig'> {}

export interface FeaturePath {
  path: string;
  dir: string;
}

export function readFeatures(
  showcaseDir: string,
  featureGlob: string,
  ignoreGlob?: string
): FeaturePath[] {
  return sync(featureGlob, {
    cwd: showcaseDir,
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
  showcaseDir: string,
  config: ShowcaseConfig
): config is ValidatedShowcaseConfig {
  if (!config.componentOut && !config.appOut) {
    throw new Error(`Specify either --componentOut or --appOut`);
  }

  if (!config.name) {
    config.name = 'Untitled';
  }

  if (!config.tsconfig) {
    config.tsconfig = 'tsconfig.json';
  }

  config.tsconfig = convertToAbsolutePath(showcaseDir, config.tsconfig);
  config.appOut = convertToAbsolutePath(showcaseDir, config.appOut);
  config.componentOut = convertToAbsolutePath(showcaseDir, config.componentOut);

  return true;
}

function convertToAbsolutePath(
  showcaseDir: string,
  path?: string
): string | undefined {
  if (path === undefined || isAbsolute(path)) {
    return path;
  }

  return join(showcaseDir, path);
}
