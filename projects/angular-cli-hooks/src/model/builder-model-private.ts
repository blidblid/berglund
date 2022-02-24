import { BuilderOutput } from '@angular-devkit/architect';
import {
  BrowserBuilderOptions,
  DevServerBuilderOptions,
  executeBrowserBuilder,
  executeDevServerBuilder,
  executeExtractI18nBuilder,
  executeKarmaBuilder,
  executeNgPackagrBuilder,
  executeProtractorBuilder,
  executeServerBuilder,
  ExtractI18nBuilderOptions,
  KarmaBuilderOptions,
  NgPackagrBuilderOptions,
  ProtractorBuilderOptions,
  ServerBuilderOptions,
} from '@angular-devkit/build-angular';
import { Observable, of } from 'rxjs';
import { BuilderCommandName } from './builder-model';

export const BUILDER_RUNNERS = {
  build: executeBrowserBuilder,
  serve: executeDevServerBuilder,
  i18n: executeExtractI18nBuilder,
  test: executeKarmaBuilder,
  'build-lib': executeNgPackagrBuilder,
  e2e: executeProtractorBuilder,
  server: executeServerBuilder,
};

export type BuilderRunners = typeof BUILDER_RUNNERS;

export const BUILDER_SUCCESS: BuilderOutput = { success: true };
export const BUILDER_SUCCESS$: Observable<BuilderOutput> = of(BUILDER_SUCCESS);

export type BuilderDirName =
  | 'app-shell'
  | 'browser'
  | 'dev-server'
  | 'extract-i18n'
  | 'karma'
  | 'ng-packagr'
  | 'protractor'
  | 'server';

export const BUILDER_DIR_NAMES: Record<BuilderCommandName, BuilderDirName> = {
  build: 'browser',
  serve: 'dev-server',
  i18n: 'extract-i18n',
  test: 'karma',
  'build-lib': 'ng-packagr',
  e2e: 'protractor',
  server: 'server',
} as const;

export type BuilderOptions = {
  build: BrowserBuilderOptions;
  serve: DevServerBuilderOptions;
  i18n: ExtractI18nBuilderOptions;
  test: KarmaBuilderOptions;
  'build-lib': NgPackagrBuilderOptions;
  e2e: ProtractorBuilderOptions;
  server: ServerBuilderOptions;
};
