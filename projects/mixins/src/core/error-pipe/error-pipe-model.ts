import { InjectionToken, ValueProvider } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { AngularValidatorHandlers } from './error-pipe-handlers';

/** Maps a validation error to a readable string. */
export type ErrorPipeHandler = (
  validationErrors: ValidationErrors | null
) => string | null;

export const ERROR_PIPE_HANDLER = new InjectionToken<ErrorPipeHandler>(
  'ERROR_PIPE_HANDLER'
);

/** Creates an ErrorPipeHandler provider. */
export function createErrorPipeHandlerProvider(
  handler: ErrorPipeHandler
): ValueProvider {
  return {
    provide: ERROR_PIPE_HANDLER,
    useValue: handler,
    multi: true,
  };
}

export const DEFAULT_ERROR_PIPE_HANDLERS = Object.values(
  new AngularValidatorHandlers()
);
