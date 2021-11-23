import { MixinComponent } from '@berglund/mixins';

export type ModelComponents<T, O extends keyof T> = {
  [P in keyof Omit<T, O>]: MixinComponent;
};
