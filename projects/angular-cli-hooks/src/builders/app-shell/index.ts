import { createBuilder } from '@angular-devkit/architect';

export default createBuilder(() => {
  throw new Error(
    'angular-cli-hooks cannot wrap app-shell, since there is no API for it.'
  );
});
