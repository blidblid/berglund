import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
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
      options,
      { workspaceRoot }: BuilderContext
    ): Promise<BuilderOutput> => {
      const eslint = new ESLint();
      const results = await eslint.lintFiles([`${workspaceRoot}/**/*.ts`]);

      if (results.length > 0) {
        console.log((await eslint.loadFormatter()).format(results));

        if (options.failOnLintErrors) {
          throw new Error('ESLint found lint errors.');
        }
      }

      return { success: true };
    },
  }),
];

export default hooks;
