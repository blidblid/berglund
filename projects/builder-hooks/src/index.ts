import { BuilderOutput } from '@angular-devkit/architect';
import { BuilderCommandName, hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

const createLogHooks = (builderName: BuilderCommandName) => {
  return hook({
    name: builderName,
    before() {
      console.log(`Calling ${builderName} builder.`);
      return { success: true };
    },
    after() {
      console.log(`Exiting ${builderName} builder.`);
      return { success: true };
    },
  });
};

export default [
  createLogHooks('build-lib'),
  createLogHooks('test'),
  createLogHooks('serve'),
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
