import { BuilderContext } from '@angular-devkit/architect';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Config } from '../../schema';
import { Hook } from '../model/hook-model';

let config: Config;

export function getConfig(context: BuilderContext): Config {
  const extendAngularCliJsonFileName = 'angular-cli-hooks.json';

  if (!config) {
    try {
      config = JSON.parse(
        readFileSync(
          join(context.workspaceRoot, extendAngularCliJsonFileName),
          'utf8'
        )
      );
    } catch {
      throw new Error(`No ${extendAngularCliJsonFileName} found.`);
    }
  }

  return config;
}

export function resolveHooks(context: BuilderContext): Hook[] {
  const packageName = getConfig(context).hookPackage;
  const hooksPackage = require(packageName);

  if (hooksPackage && Array.isArray(hooksPackage.default)) {
    return hooksPackage.default;
  } else {
    throw new Error(
      `Could not resolve any hooks in package ${packageName}. Found ${hooksPackage}.`
    );
  }
}
