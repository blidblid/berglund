import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { JSONSchema7 } from 'json-schema';
import { BuilderCommandName, GenericBuilderOutput } from './builder-model';
import { BuilderOptions } from './builder-model-private';
import { SchemaToOptions } from './schema-model';

/** A hook into a native Angular CLI builder. */
export interface Hook<T extends BuilderCommandName, S extends JSONSchema7> {
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

/** Creates a hook. */
export function hook<T extends BuilderCommandName, S extends JSONSchema7>(
  hook: Hook<T, S>
): Hook<T, S> {
  return hook;
}
