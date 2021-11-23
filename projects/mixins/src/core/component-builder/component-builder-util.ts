import {
  MixinComponent,
  MixinComponentInputs,
  MixinComponentValueAccessor,
} from './component-builder-model';

export function component<T>(
  mixinComponent: MixinComponent<T>,
  inputs?: MixinComponentInputs<T>
): MixinComponent<T> {
  if (!inputs) {
    return mixinComponent;
  }

  return {
    ...mixinComponent,
    inputs: { ...mixinComponent.inputs, ...inputs },
  };
}

export function components<T1 extends MixinComponentValueAccessor>(
  v1: MixinComponent<T1>
): [MixinComponent<T1>];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>
): [MixinComponent<T1>, MixinComponent<T2>];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>
): [MixinComponent<T1>, MixinComponent<T2>, MixinComponent<T3>];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor,
  T4 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>,
  v4: MixinComponent<T4>
): [
  MixinComponent<T1>,
  MixinComponent<T2>,
  MixinComponent<T3>,
  MixinComponent<T4>
];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor,
  T4 extends MixinComponentValueAccessor,
  T5 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>,
  v4: MixinComponent<T4>,
  v5: MixinComponent<T4>
): [
  MixinComponent<T1>,
  MixinComponent<T2>,
  MixinComponent<T3>,
  MixinComponent<T4>,
  MixinComponent<T5>
];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor,
  T4 extends MixinComponentValueAccessor,
  T5 extends MixinComponentValueAccessor,
  T6 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>,
  v4: MixinComponent<T4>,
  v5: MixinComponent<T5>,
  v6: MixinComponent<T6>
): [
  MixinComponent<T1>,
  MixinComponent<T2>,
  MixinComponent<T3>,
  MixinComponent<T4>,
  MixinComponent<T5>,
  MixinComponent<T6>
];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor,
  T4 extends MixinComponentValueAccessor,
  T5 extends MixinComponentValueAccessor,
  T6 extends MixinComponentValueAccessor,
  T7 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>,
  v4: MixinComponent<T4>,
  v5: MixinComponent<T5>,
  v6: MixinComponent<T6>,
  v7: MixinComponent<T7>
): [
  MixinComponent<T1>,
  MixinComponent<T2>,
  MixinComponent<T3>,
  MixinComponent<T4>,
  MixinComponent<T5>,
  MixinComponent<T6>,
  MixinComponent<T7>
];
export function components<
  T1 extends MixinComponentValueAccessor,
  T2 extends MixinComponentValueAccessor,
  T3 extends MixinComponentValueAccessor,
  T4 extends MixinComponentValueAccessor,
  T5 extends MixinComponentValueAccessor,
  T6 extends MixinComponentValueAccessor,
  T7 extends MixinComponentValueAccessor,
  T8 extends MixinComponentValueAccessor
>(
  v1: MixinComponent<T1>,
  v2: MixinComponent<T2>,
  v3: MixinComponent<T3>,
  v4: MixinComponent<T4>,
  v5: MixinComponent<T5>,
  v6: MixinComponent<T6>,
  v7: MixinComponent<T7>,
  v8: MixinComponent<T8>
): [
  MixinComponent<T1>,
  MixinComponent<T2>,
  MixinComponent<T3>,
  MixinComponent<T4>,
  MixinComponent<T5>,
  MixinComponent<T6>,
  MixinComponent<T7>,
  MixinComponent<T8>
];
export function components(
  ...value: MixinComponent<any>[]
): MixinComponent<any>[] {
  return value;
}
