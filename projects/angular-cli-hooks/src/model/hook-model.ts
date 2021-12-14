import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { BuilderName, GenericBuilderOutput } from './builder-model';

export interface Hook {
  name: BuilderName;
  before?: (context: BuilderContext) => GenericBuilderOutput;
  override?: (context: BuilderContext) => GenericBuilderOutput;
  after?: (
    context: BuilderContext,
    builderOutput: BuilderOutput
  ) => GenericBuilderOutput;
}
