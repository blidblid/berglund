export interface Label {
  /** Hint text below the component. */
  hint: string;

  /** Label text above the component. */
  label: string;

  /** Text to be shown when no value is selected. */
  placeholder: string;

  /** Aria label that sets the aria-label attribute. */
  ariaLabel: string;

  /** Aria label that sets the aria-label attribute. */
  ariaLabelledby: string | null;
}
