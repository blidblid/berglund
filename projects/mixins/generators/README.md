# Generators

## Mapping models to components

With `@berglund/mixins`, components are fully described as objects.

```typescript
const luckyNumber: MixinComponent = component({
  component: BergInputComponent,
  inputs: {
    label: 'Lucky number',
  },
});
```

As such, it is simple to write mappings between models and components:

```typescript
export type Generator = (schema: JSONSchema7) => {
  mixinComponent: MixinComponent<T>;
  packageName: string;
};

export const checkboxGenerator = (
  schema: JSONSchema7,
  context: MixinComponentGeneratorContext
) => {
  if (schema.type !== 'boolean') {
    return null;
  }

  return {
    packageName: '@berglund/material',
    mixinComponent: {
      BergCheckboxComponent,
      inputs: {
        ...createLabelInputs(schema, context),
        ...createStatefulInputs(schema, context),
      },
    },
  };
};
```

`@berglund/mixins/generators` has several ready-made mappings between schemas and components.

## Generating components

`@berglund/cli` uses mappings to generate components.
So that when a new model is added to an app, then a fresh set of components is generated to edit and present that model.
It also maps different types to JSONSchema: if you use TypeScript or plain JSON to describe your models, then `@berglund/cli` will convert them to JSONSchema.

## Using the generated components

The generated components should always be simple. If a generated component is missing something, then extend it:

```typescript
const favoriteNumber = component({
  component: components.Person.LuckyNumber,
  inputs: {
    label: 'Favorite number',
  },
});
```
