import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { JSONSchema7 } from 'json-schema';
import {
  BuilderName,
  BuilderOptions,
  GenericBuilderOutput,
} from './builder-model';

type SchemaToOptions<T extends JSONSchema7> = Record<
  keyof T['properties'],
  any
>;

export interface Hook<T extends BuilderName, S extends JSONSchema7> {
  name: T;
  schema?: S;
  before?: (
    options: BuilderOptions[T] & SchemaToOptions<S>,
    context: BuilderContext
  ) => GenericBuilderOutput;
  override?: (
    options: BuilderOptions[T] & SchemaToOptions<S>,
    context: BuilderContext
  ) => GenericBuilderOutput;
  after?: (
    options: BuilderOptions[T] & SchemaToOptions<S>,
    context: BuilderContext,
    builderOutput: BuilderOutput
  ) => GenericBuilderOutput;
}

export type GenericHook = Hook<BuilderName, Record<string, never>>;

export function hook<T extends BuilderName, S extends JSONSchema7>(
  hook: Hook<T, S>
): Hook<T, S> {
  return hook;
}
