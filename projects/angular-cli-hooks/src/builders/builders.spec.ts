import { BuilderContext } from '@angular-devkit/architect';
import {
  DevServerBuilderOptions,
  DevServerBuilderOutput,
} from '@angular-devkit/build-angular';
import { of } from 'rxjs';
import { executeWithHook } from '../core/exec';
import { BuilderRunners } from '../model/builder-model-private';
import { hook } from '../model/hook-model';
import { createWrappedBuilder } from './create-wrapped-builder';
import createSpyObj = jasmine.createSpyObj;

describe('builders', () => {
  const builderOptions = {} as DevServerBuilderOptions;
  const builderContext = {} as BuilderContext;
  const syncBuilderOutput = { success: true } as DevServerBuilderOutput;
  const builderOutputs = [
    ['observable', of(syncBuilderOutput)],
    ['promise', Promise.resolve(syncBuilderOutput)],
    ['sync', syncBuilderOutput],
  ] as const;

  let builderRunners: jasmine.SpyObj<BuilderRunners>;

  beforeEach(() => {
    builderRunners = createSpyObj('builderRunners', ['serve']);
    builderRunners.serve.and.returnValue(of(syncBuilderOutput));
  });

  for (const builderOutput of builderOutputs) {
    describe(`with ${builderOutput[0]} based builder output`, () => {
      it('should a execute builder, an after hook, and a before hook', async () => {
        const calls: ('after' | 'before' | 'override')[] = [];
        const builder = createWrappedBuilder('serve', builderRunners);

        const serveHook = hook({
          name: 'serve',
          before: () => {
            calls.push('before');
            return builderOutput[1];
          },
          after: () => {
            calls.push('after');
            return builderOutput[1];
          },
        });

        executeWithHook(
          builderOptions,
          builderContext,
          () => builder(builderOptions, builderContext),
          serveHook
        ).subscribe();

        await tickMicroTasks(1);

        expect(calls).toEqual(['before', 'after']);
        expect(builderRunners.serve).toHaveBeenCalled();
      });

      it('should override a builder, and execute an after hook and a before hook', async () => {
        const calls: ('after' | 'before' | 'override')[] = [];
        const builder = createWrappedBuilder('serve', builderRunners);

        const serveHook = hook({
          name: 'serve',
          before: () => {
            calls.push('before');
            return builderOutput[1];
          },
          override: () => {
            calls.push('override');
            return builderOutput[1];
          },
          after: () => {
            calls.push('after');
            return builderOutput[1];
          },
        });

        executeWithHook(
          builderOptions,
          builderContext,
          () => builder(builderOptions, builderContext),
          serveHook
        ).subscribe();

        await tickMicroTasks(2);

        expect(calls).toEqual(['before', 'override', 'after']);
        expect(builderRunners.serve).not.toHaveBeenCalled();
      });
    });
  }

  async function tickMicroTasks(count: number): Promise<void> {
    while (count--) {
      await Promise.resolve();
    }
  }
});
