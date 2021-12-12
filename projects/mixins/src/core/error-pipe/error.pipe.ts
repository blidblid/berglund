import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  DEFAULT_ERROR_PIPE_HANDLERS,
  ErrorPipeHandler,
  ERROR_PIPE_HANDLER,
} from './error-pipe-model';

/**
 * Maps `ValidationError` to readable error messages.
 */
@Pipe({
  name: 'error',
})
export class BergErrorPipe implements PipeTransform {
  constructor(
    @Optional() @Inject(ERROR_PIPE_HANDLER) private handlers: ErrorPipeHandler[]
  ) {
    this.handlers = handlers ?? DEFAULT_ERROR_PIPE_HANDLERS;
  }

  transform(value: ValidationErrors | null): string {
    for (const handler of this.handlers) {
      const errorMessage = handler(value);
      if (errorMessage) {
        return errorMessage;
      }
    }

    return '';
  }
}
