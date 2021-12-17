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

export const BUILDERS = {
  executeBrowserBuilder,
  executeDevServerBuilder,
  executeExtractI18nBuilder,
  executeKarmaBuilder,
  executeNgPackagrBuilder,
  executeProtractorBuilder,
  executeServerBuilder,
};

export const BUILDER_SUCCESS: BuilderOutput = { success: true };
export const BUILDER_SUCCESS$: Observable<BuilderOutput> = of(BUILDER_SUCCESS);

export type Builders = typeof BUILDERS;
export type BuilderName = keyof Builders;

export type BuilderOptions = {
  executeBrowserBuilder: BrowserBuilderOptions;
  executeDevServerBuilder: DevServerBuilderOptions;
  executeExtractI18nBuilder: ExtractI18nBuilderOptions;
  executeKarmaBuilder: KarmaBuilderOptions;
  executeNgPackagrBuilder: NgPackagrBuilderOptions;
  executeProtractorBuilder: ProtractorBuilderOptions;
  executeServerBuilder: ServerBuilderOptions;
};

export const BUILDER_DIR_NAMES = {
  executeBrowserBuilder: 'browser',
  executeDevServerBuilder: 'dev-server',
  executeExtractI18nBuilder: 'extract-i18n',
  executeKarmaBuilder: 'karma',
  executeNgPackagrBuilder: 'ng-packagr',
  executeProtractorBuilder: 'protractor',
  executeServerBuilder: 'server',
} as const;

export type GenericBuilderOutput =
  | Observable<BuilderOutput>
  | Promise<BuilderOutput>
  | BuilderOutput;
