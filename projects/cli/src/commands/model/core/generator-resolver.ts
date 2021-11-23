import { MixinComponentGenerator } from '@berglund/mixins/generators';
import { Context } from './context';

export class GeneratorResolver {
  constructor(private context: Context) {}

  getGenerators(): MixinComponentGenerator[] {
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
