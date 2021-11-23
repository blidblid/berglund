import { MixinComponent } from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';

export type MixinComponentGenerator<T = any> = (
  schema: JSONSchema7,
  context: MixinGeneratorContext
) => MixinComponentGeneratorOutput<T> | null;

export interface MixinComponentGeneratorOutput<T = any> {
  mixinComponent: MixinComponent<T>;
  packageName: string;
}

export interface MixinGeneratorContext {
  key: string;
  parentSchema?: JSONSchema7;
}
