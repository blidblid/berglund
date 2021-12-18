import { BuilderOutput } from '@angular-devkit/architect';
import { hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

const hooks = [
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

export default hooks;
