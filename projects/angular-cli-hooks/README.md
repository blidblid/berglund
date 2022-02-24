# Angular CLI hooks

This small package hooks into native Angular CLI builders. With it, you can...

- ... run code **before** Angular CLI invocates native builders
- ... and/or **override** invocations
- ... and/or run code **after** invocations

A few examples include

- Running `eslint` before `ng build` runs
- Using `jest` over `jasmine` when running `ng test`
- Starting a mock server with `ng serve`

## Usage

### Step 1 - creating a hook package

First, you need to create a package of hooks. To run ESLint before `ng build`, add both a hook to `build` and a before-function. The before-function can return either `Observable`, `Promise` or a sync value.

Then, to make the hook configurable, use the `schema`-property to add a JsonSchema for any configurations. The hook schema is merged with the native Angular CLI builder schema, making both the hook configuration and the builder configuration available when implementing the hook. Both are also listed when running `ng build --help` 🥳.

```typescript
// index.ts in @berglund/builder-hooks

import { BuilderOutput } from '@angular-devkit/architect';
import { hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

export default [
  hook({
    name: 'build',
    schema: {
      properties: {
        failOnLintErrors: {
          type: 'boolean',
          description: 'Whether to fail the build on lint errors.',
        },
      },
    },
    before: async (
      { failOnLintErrors },
      { workspaceRoot }
    ): Promise<BuilderOutput> => {
      const eslint = new ESLint();
      const results = await eslint.lintFiles([`${workspaceRoot}/**/*.ts`]);

      if (results.length > 0) {
        console.log((await eslint.loadFormatter()).format(results));

        if (failOnLintErrors) {
          throw new Error('ESLint found lint errors.');
        }
      }

      return { success: true };
    },
  }),
];
```

### Step 2 - using a hook package

Install the hook package wherever you want to hook into Angular CLI. Then add a `angular-cli-hooks.json` file to your project and specify the name of the package of hooks

```json
{
  "$schema": "./node_modules/@berglund/angular-cli-hooks/schema.json",
  "hookPackage": "@berglund/builder-hooks"
}
```

or for multiple hook packages

```json
{
  "$schema": "./node_modules/@berglund/angular-cli-hooks/schema.json",
  "hookPackage": ["@berglund/builder-hooks", "@berglund/more-builder-hooks"]
}
```

### Step 3 - updating angular.json

Update angular.json to use `@berglund/angular-cli-hooks` over `@angular-devkit/build-angular`.

```json
{
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:browser"
    }
  }
}
```

becomes

```json
{
  "architect": {
    "build": {
      "builder": "@berglund/angular-cli-hooks:browser"
    }
  }
}
```

And that's it.
