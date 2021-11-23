import { ValidationErrors, Validators } from '@angular/forms';
import { ErrorPipeHandler } from './error-pipe-model';

export class AngularValidatorHandlers
  implements
    Omit<
      {
        [P in keyof typeof Validators]: ErrorPipeHandler;
      },
      'prototype' | 'compose' | 'composeAsync' | 'nullValidator'
    >
{
  min = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['min'];

    if (error) {
      return `${error.actual} is smaller than ${error.min}.`;
    }

    return null;
  };

  max = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['max'];

    if (error) {
      return `${error.actual} is greater than ${error.max}.`;
    }

    return null;
  };

  required = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['required'];

    if (error) {
      return `This field is required.`;
    }

    return null;
  };

  requiredTrue = (validationErrors: ValidationErrors | null): string | null => {
    return this.required(validationErrors);
  };

  email = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['email'];

    if (error) {
      return `Input an email.`;
    }

    return null;
  };

  minLength = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['minlength'];

    if (error) {
      return `Min length ${error.requiredLength}, actual length ${error.actualLength}.`;
    }

    return null;
  };

  maxLength = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['maxLength'];

    if (error) {
      return `Max length ${error.requiredLength}, actual length ${error.actualLength}.`;
    }

    return null;
  };

  pattern = (validationErrors: ValidationErrors | null): string | null => {
    const error = validationErrors && validationErrors['pattern'];

    if (error) {
      return `${error.actualValue} does not match the pattern ${error.requiredPattern}.`;
    }

    return null;
  };
}
