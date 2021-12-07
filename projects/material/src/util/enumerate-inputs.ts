import { Type } from '@angular/core';
import {
  MixinComponentInputs,
  MustInclude,
  NonEmptyArray,
} from '@berglund/mixins';

// Note that this function has to be local to @berglund/material, for AoT.
/** Helper function to strongly type component inputs. */
export function enumerateInputs<
  T,
  C extends keyof MixinComponentInputs<T>,
  U extends NonEmptyArray<C>
>(component: Type<T>, ...elements: MustInclude<C, U>): MustInclude<C, U> {
  return elements;
}
