import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  BuilderName,
  BUILDER_SUCCESS$,
  GenericBuilderOutput,
} from '../model/builder-model';
import { Hook } from '../model/hook-model';
import { resolveHooks } from './context';
import { isPromise } from './util';

export function execute(
  context: BuilderContext,
  name: BuilderName,
  executeBuilder: () => GenericBuilderOutput
): Observable<BuilderOutput> {
  const hooks = resolveHooks(context);
  const builderHooks = hooks.find((hook) => hook.name === name);
  return executeWithHooks(context, executeBuilder, builderHooks);
}

function executeWithHooks(
  context: BuilderContext,
  executeBuilder: () => GenericBuilderOutput,
  hook?: Hook
): Observable<BuilderOutput> {
  const {
    before = (_: BuilderContext) => BUILDER_SUCCESS$,
    override,
    after = (_: BuilderContext, __: BuilderOutput) => BUILDER_SUCCESS$,
  } = hook ?? {};

  return toObservableBuilderOutput(before(context)).pipe(
    switchMap(() => {
      const genericBuilderOutput = override
        ? override(context)
        : executeBuilder();

      return toObservableBuilderOutput(genericBuilderOutput);
    }),
    switchMap((output) => toObservableBuilderOutput(after(context, output)))
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
