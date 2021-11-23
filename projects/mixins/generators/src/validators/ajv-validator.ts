import { AbstractControl, ValidatorFn } from '@angular/forms';
import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';

const ajv = new Ajv();

export function jsonSchemaValidator(schema: JSONSchema7): ValidatorFn {
  return (control: AbstractControl) => {
    const validate = ajv.compile(schema);
    validate(control.value);

    return validate.errors ?? null;
  };
}
