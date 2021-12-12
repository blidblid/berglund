import { Connectable } from '@berglund/rx';
import { IncludeType } from '../../util';

/**
 * Any component that shows several values is a Collection.
 * Tables, selects and radio groups are similar in that way.
 */
export interface Collection<
  S extends CollectionSelectionType = CollectionSelectionType,
  T = any
> {
  /** Collection data. */
  data: T[];

  /** Plucks a label from T. */
  pluckLabel: CollectionPluckLabel<T>;

  /** Plucks whether a value T is disabled. */
  pluckDisabled: CollectionPluckDisabled<T>;

  /** Plucks whether a value T is rearrangeable. */
  pluckRearrangeable: CollectionPluckRearrangeable<T>;

  /** Function to group data by. */
  groupBy: CollectionGroupByFn<T> | null;

  /** Comparators to sort data by. */
  comparators: CollectionSortComparators<T> | null;

  /** A Connectable to connect with. */
  connectCollection: Connectable<T[]>;

  /** Selection type. */
  selection?: S;
}

/** Determines how many values a user can select.
 *
 * - none: 0
 * - radio: 1
 * - single: 0-1
 * - multiple: 0 or more
 */
export type CollectionSelectionType = 'single' | 'radio' | 'multiple' | 'none';

/** Function pluck labels with. */
export type CollectionPluckLabelFn<T> = (value: T) => string;

/** Function or key to pluck labels with. */
export type CollectionPluckLabel<T> =
  | keyof IncludeType<T, string>
  | CollectionPluckLabelFn<T>;

/** Function pluck disabled with. */
export type CollectionPluckDisabledFn<T> = (value: T) => boolean;

/** Function or key to pluck disabled with. */
export type CollectionPluckDisabled<T> =
  | keyof IncludeType<T, boolean>
  | CollectionPluckDisabledFn<T>;

/** Function pluck rearrangeable with. */
export type CollectionPluckRearrangeableFn<T> = (value: T) => boolean;

/** Function or key to pluck rearrangeable with. */
export type CollectionPluckRearrangeable<T> =
  | keyof IncludeType<T, boolean>
  | CollectionPluckRearrangeableFn<T>;

export type CollectionSortComparators<T> = Record<
  keyof T,
  CollectionSortComparator<T>
>;

export type CollectionSortComparator<T> = (
  a: T,
  b: T,
  descending?: boolean
) => number;

export type CollectionGroupByFn<T> = (values: T[]) => CollectionGroup[];

export interface CollectionGroup<T = any> {
  data: T[];
  label: string;
}
