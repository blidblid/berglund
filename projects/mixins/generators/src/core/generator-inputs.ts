import {
  Collection,
  Label,
  MixinComponentInputs,
  Stateful,
} from '@berglund/mixins';
import { JSONSchema7 } from 'json-schema';
import { MixinGeneratorContext } from '.';
import { isRequiredSchema, prettyPrintKey } from './generator-util';

export function createLabelInputs(
  schema: JSONSchema7,
  context: MixinGeneratorContext
): MixinComponentInputs<Label> {
  const inputs: MixinComponentInputs<Label> = {};

  if (schema.title) {
    inputs.label = inputs.ariaLabel = schema.title;
  } else {
    inputs.label = inputs.ariaLabel = prettyPrintKey(context.key);
  }

  return inputs;
}

export function createStatefulInputs(
  schema: JSONSchema7,
  context: MixinGeneratorContext
): MixinComponentInputs<Stateful> {
  const inputs: MixinComponentInputs<Stateful> = {};

  if ('readOnly' in schema) {
    inputs.readonly = schema.readOnly;
  }

  if (
    context.parentSchema &&
    isRequiredSchema(context.parentSchema, context.key)
  ) {
    inputs.required = true;
  }

  return inputs;
}

export function createSelectionInputs(
  schema: JSONSchema7
): MixinComponentInputs<Collection> {
  const inputs: MixinComponentInputs<Collection> = {};

  if (schema.maxItems && schema.maxItems > 1) {
    inputs.selection = 'multiple';
  } else if (schema.minItems === 0) {
    inputs.selection = 'single';
  } else if (schema.minItems === 1) {
    inputs.selection = 'radio';
  }

  if (Array.isArray(schema.enum)) {
    inputs.data = schema.enum;
  }

  return inputs;
}
