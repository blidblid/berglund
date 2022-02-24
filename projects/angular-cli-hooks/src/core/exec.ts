import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  BuilderCommandName,
  GenericBuilderOutput,
} from '../model/builder-model';
import {
  BuilderOptions,
  BUILDER_SUCCESS$,
} from '../model/builder-model-private';
import { Hook } from '../model/hook-model';
import { resolveHooks } from './context';
import { isPromise } from './util';

export function execute<T extends BuilderCommandName>(
  options: BuilderOptions[T],
  context: BuilderContext,
  name: BuilderCommandName,
  executeBuilder: () => GenericBuilderOutput
): Observable<BuilderOutput> {
  const hooks = resolveHooks(context.workspaceRoot);
  const builderHooks = hooks.find((hook) => hook.name === name);

  return executeWithHook(options, context, executeBuilder, builderHooks);
}

export function executeWithHook<T extends BuilderCommandName>(
  options: BuilderOptions[T],
  context: BuilderContext,
  executeBuilder: () => GenericBuilderOutput,
  hook?: Hook<T, {}>
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
