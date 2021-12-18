import { BuilderContext } from '@angular-devkit/architect';
import { execute } from '../core/exec';
import {
  BuilderCommandName,
  BuilderRunners,
  BUILDER_RUNNERS,
} from '../model/builder-model';

export function createWrappedBuilder<T extends BuilderCommandName>(name: T) {
  return (...args: Parameters<BuilderRunners[T]>) => {
    return execute(args[0], args[1], name, () => {
      // typecast since TypeScript disallows passing
      // Parameters<Builders[T]> as a spread argument
      return BUILDER_RUNNERS[name](...(args as [any, BuilderContext]));
    });
  };
}
