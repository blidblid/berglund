import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  BuilderName,
  BuilderOptions,
  BUILDER_SUCCESS$,
  GenericBuilderOutput,
} from '../model/builder-model';
import { Hook } from '../model/hook-model';
import { resolveHooks } from './context';
import { isPromise } from './util';

export function execute<T extends BuilderName>(
  options: BuilderOptions[T],
  context: BuilderContext,
  name: BuilderName,
  executeBuilder: () => GenericBuilderOutput
): Observable<BuilderOutput> {
  const hooks = resolveHooks(context.workspaceRoot);
  const builderHooks = hooks.find((hook) => hook.name === name);
  return executeWithHooks(options, context, executeBuilder, builderHooks);
}

function executeWithHooks<T extends BuilderName>(
  options: BuilderOptions[T],
  context: BuilderContext,
  executeBuilder: () => GenericBuilderOutput,
  hook?: Hook<T, Record<string, never>>
): Observable<BuilderOutput> {
  const {
    override,
    before = (_: BuilderOptions[T], __: BuilderContext) => BUILDER_SUCCESS$,
    after = (_: BuilderOptions[T], __: BuilderContext, ___: BuilderOutput) => {
      return BUILDER_SUCCESS$;
    },
  } = hook ?? {};

  return toObservableBuilderOutput(before(options, context)).pipe(
    switchMap(() => {
      const genericBuilderOutput = override
        ? override(options, context)
        : executeBuilder();

      return toObservableBuilderOutput(genericBuilderOutput);
    }),
    switchMap((output) => {
      return toObservableBuilderOutput(after(options, context, output));
    })
  );
}

function toObservableBuilderOutput(
  genericBuilderOutput: GenericBuilderOutput
): Observable<BuilderOutput> {
  if (isObservable(genericBuilderOutput)) {
    return genericBuilderOutput;
  }

  if (isPromise<BuilderOutput>(genericBuilderOutput)) {
    return from(genericBuilderOutput);
  }

  return of(genericBuilderOutput);
}
