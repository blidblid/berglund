export interface Stateful {
  /** Whether the component is required to have a value. */
  required: boolean;

  /** Whether the component cannot be edited. */
  readonly: boolean;
}
