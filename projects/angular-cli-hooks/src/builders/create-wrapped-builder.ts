import { BuilderContext } from '@angular-devkit/architect';
import { execute } from '../core/exec';
import { BuilderName, Builders, BUILDERS } from '../model/builder-model';

export function createWrappedBuilder<T extends BuilderName>(name: T) {
  return (...args: Parameters<Builders[T]>) => {
    return execute(args[1], name, () => {
      // typecast since TypeScript disallows passing
      // Parameters<Builders[T]> as a spread argument
      return BUILDERS[name](...(args as [any, BuilderContext]));
    });
  };
}
