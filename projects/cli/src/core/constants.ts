import { join, resolve } from 'path';

export const fileNames = {
  featureConfig: 'feature.json',
  showcaseConfig: 'showcase.json',
  modelConfig: 'model.json',
  package: 'package.json',
  tsconfig: 'tsconfig.lib.json',
  apiJson: 'api.json',
  sharedModule: 'shared.module.ts',
  showcaseConfigModule: 'showcase.ts',
  routes: 'routes.ts',
  index: 'index.ts',
  features: 'features.ts',
  readmeMd: 'README.md',
  tsdoc: {
    index: 'index.html',
    modules: 'modules.html',
  },
};

export const directories = {
  internalComponents: 'components',
  api: 'api',
  tsdoc: {
    assets: 'assets',
    classes: 'classes',
  },
  git: '.git',
};

export const paths = {
  app: resolve(join(__dirname, '../../app')),
  temp: resolve(join(__dirname, '../../tmp')),
  internalComponents: resolve(
    join(__dirname, `../../${directories.internalComponents}`)
  ),
  appComponentOut: 'src/generated',
};

export const prefixes = {
  apiComponent: 'api',
  readmeComponent: 'readme',
  containerComponent: '',
};
