# Angular CLI hooks

This small package hooks into native Angular CLI builders. With it, you can...

- ... run code **before** Angular CLI invocates native builders
- ... and/or **override** invocations
- ... and/or run code **after** invocations

A few examples include

- Running `eslint` to after the `ng build` finishes
- Using `jest` over `jasmine` when running `ng test`
- Generate `tsconfig.json` before running `ng serve`

## Hooking into Angular CLI builders

First, you need to create a package of hooks. To add ESLint to `ng-build`, just add a hook to `executeBrowserBuilder`:

```typescript
// index.ts
import { BuilderOutput } from '@angular-devkit/architect';
import { Hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

const hooks: Hook[] = [
  {
    name: 'executeBrowserBuilder',
    after: async ({ workspaceRoot }): Promise<BuilderOutput> => {
      const eslint = new ESLint();
      const results = await eslint.lintFiles([`${workspaceRoot}/**/*.ts`]);

      if (results.length > 0) {
        throw new Error('Linting failed.');
      }

      return { success: true };
    },
  },
];

export default hooks;
```
