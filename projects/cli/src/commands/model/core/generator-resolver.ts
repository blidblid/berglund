import { MixinComponentGenerator } from '@berglund/mixins/generators';
import { Context } from './context';

export class GeneratorResolver {
  constructor(private context: Context) {}

  getGenerators(): MixinComponentGenerator[] {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const generatorPackage = require(this.context.config.package);

    try {
      return Object.values(generatorPackage);
    } catch {
      throw new Error(
        `Could not resolve any generators in package ${this.context.config.package}`
      );
    }
  }
}
