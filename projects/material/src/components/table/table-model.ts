/** Function pluck cell labels with. */
export type BergTablePluckCellLabelFn<T = any> = (
  value: T,
  property: keyof T
) => string;
