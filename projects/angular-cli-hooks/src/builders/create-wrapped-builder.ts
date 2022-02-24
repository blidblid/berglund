import { BuilderContext } from '@angular-devkit/architect';
import { execute } from '../core/exec';
import { BuilderCommandName } from '../model/builder-model';
import {
  BuilderRunners,
  BUILDER_RUNNERS,
} from '../model/builder-model-private';

export function createWrappedBuilder<T extends BuilderCommandName>(
  name: T,
  builderRunners = BUILDER_RUNNERS
) {
  return (...args: Parameters<BuilderRunners[T]>) => {
    return execute(args[0], args[1], name, () => {
      // typecast since TypeScript disallows passing
      // Parameters<Builders[T]> as a spread argument
      return builderRunners[name](...(args as [any, BuilderContext]));
    });
  };
}
