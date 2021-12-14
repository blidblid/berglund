import { BuilderOutput } from '@angular-devkit/architect';
import {
  executeBrowserBuilder,
  executeDevServerBuilder,
  executeExtractI18nBuilder,
  executeKarmaBuilder,
  executeNgPackagrBuilder,
  executeProtractorBuilder,
  executeServerBuilder,
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

export type GenericBuilderOutput =
  | Observable<BuilderOutput>
  | Promise<BuilderOutput>
  | BuilderOutput;
