import { ValidationErrors } from '@angular/forms';

/** Merges several ValidationErrors into one ValidationErrors. */
export function mergeValidationErrors(
  ...validationErrors: (ValidationErrors | null)[]
): ValidationErrors | null {
  const errors: ValidationErrors = {};
  let hasErrors = false;

  for (const validationError of validationErrors.filter(
    (error) => error !== null
  )) {
    Object.assign(errors, validationError);
    hasErrors = true;
  }

  return hasErrors ? errors : null;
}
