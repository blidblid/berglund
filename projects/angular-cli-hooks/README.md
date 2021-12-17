# Angular CLI hooks

This small package hooks into native Angular CLI builders. With it, you can...

- ... run code **before** Angular CLI invocates native builders
- ... and/or **override** invocations
- ... and/or run code **after** invocations

A few examples include

- Running `eslint` before `ng build` runs
- Using `jest` over `jasmine` when running `ng test`

## Hooking into Angular CLI builders

### Step 1

First, you need to create a package of hooks. To add ESLint to `ng build`, add a hook to `executeBrowserBuilder`.

Then, if you want to the code configurable, add a JsonSchema for those configurations.

```typescript
import { BuilderOutput } from '@angular-devkit/architect';
import { hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

const hooks = [
  hook({
    schema: {
      properties: {
        failOnLintErrors: {
          type: 'boolean',
          description: 'Whether to fail the build on lint errors.',
        },
      },
    },
    name: 'executeBrowserBuilder',
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

export default hooks;
```

### Step 2

Add a `angular-cli-hooks.json` file to your project and add the name of the package of hooks

```json
{
  "$schema": "./node_modules/@berglund/angular-cli-hooks/schema.json",
  "hookPackage": "@berglund/builder-hooks"
}
```

### Step 3

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
