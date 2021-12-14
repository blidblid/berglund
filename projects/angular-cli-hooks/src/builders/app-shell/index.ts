import { createBuilder } from '@angular-devkit/architect';

export default createBuilder((...args: [any, any]) => {
  throw new Error(
    'angular-cli-hooks cannot wrap app-shell, since there is no API for it.'
  );
});
