import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Hook } from '@berglund/angular-cli-hooks';
import { ESLint } from 'eslint';

const hooks: Hook[] = [
  {
    name: 'executeBrowserBuilder',
    after: async ({
      workspaceRoot,
    }: BuilderContext): Promise<BuilderOutput> => {
      const eslint = new ESLint();
      const results = await eslint.lintFiles([`${workspaceRoot}/**/*.ts`]);

      if (results.length > 0) {
        throw new Error('');
      }

      return { success: true };
    },
  },
];

export default hooks;
