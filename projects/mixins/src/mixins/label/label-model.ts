export interface Label {
  /** Hint text below the component. */
  hint: string;

  /** Label text above the component. */
  label: string;

  /** Text to be shown when no value is selected. */
  placeholder: string;

  /** Sets the aria-label attribute. */
  ariaLabel: string;

  /** Sets the aria-labelledby attribute. */
  ariaLabelledby: string | null;
}
