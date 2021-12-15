import { existsSync, readFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { JSDOM } from 'jsdom';
import marked from 'marked';
import * as yargs from 'yargs';
import { readConfigs } from '../../core';
import { directories, fileNames, paths } from '../../core/constants';
import { join } from '../../core/path';
import { TsAstParser } from '../../core/ts-ast/ts-ast-parser';
import { ApiComponentFactory } from './components/api/api-component-factory';
import { ApiDomBuilder } from './components/api/api-dom-builder';
import { TsdocAstParser } from './components/api/tsdoc-ast-parser';
import { ContainerComponentFactory } from './components/container/container-component-factory';
import { ContainerDomBuilder } from './components/container/container-dom-builder';
import { ReadmeComponentFactory } from './components/readme/readme-component-factory';
import { ReadmeDomBuilder } from './components/readme/readme-dom-builder';
import { Context } from './core/context';
import { Component, ContainerComponent, File } from './core/dom-builder-model';
import {
  readFeatures,
  validateConfig,
  ValidatedShowcaseConfig,
} from './core/read';
import { TsComponentAstPrinter } from './core/ts-component-ast-printer';
import {
  buildApp,
  createOutDir,
  writeApp,
  writeCommonComponents,
  writeComponent,
} from './core/write';
import { ShowcaseConfig } from './schemas/showcase/schema';
import schema from './schemas/showcase/schema.json';

export const SHOWCASE_COMMAND: yargs.CommandModule = {
  command: 'showcase',
  describe: 'Generates a showcase.',
  builder: (yargs: yargs.Argv) => {
    for (const [key, value] of Object.entries(schema.properties)) {
      yargs.option(key, {
        demandOption: schema.required.includes(key),
        describe: value['description'],
        default: value['default'],
      });
    }

    return yargs;
  },
  handler,
};

async function handler(args: yargs.Arguments<ShowcaseConfig>): Promise<void> {
  for (const configFile of readConfigs<ShowcaseConfig>(
    fileNames.showcaseConfig
  )) {
    const config: ShowcaseConfig = {
      ...args,
      ...configFile.content,
    };

    console.log(`Creating showcase for ${configFile.dir}`);

    if (!validateConfig(configFile.dir, config)) {
      return;
    }

    const getComponents: GetComponent[] = [];

    if (config.api) {
      getComponents.push(getApiComponent);
    }

    if (config.readme) {
      getComponents.push(getReadmeComponent);
    }

    await showcase(config, configFile.dir, getComponents);
  }
}

export const getReadmeComponent = (context: Context) => {
  const readmePath = join(
    context.featureDir,
    context.featureConfig.readmePath || fileNames.readmeMd
  );

  if (!existsSync(readmePath)) {
    return null;
  }

  const html = marked(readFileSync(readmePath, 'utf-8'));
  const jsDom = new JSDOM(html);

  return new ReadmeComponentFactory(
    context,
    new ReadmeDomBuilder(jsDom, new TsAstParser()),
    new TsComponentAstPrinter()
  ).create();
};

export const getApiComponent = async (context: Context) => {
  const entryPointPath = join(
    context.featureDir,
    context.featureConfig.entryPointPath ?? fileNames.index
  );

  if (!existsSync(entryPointPath)) {
    return null;
  }

  const apiGroups = await new TsdocAstParser(context, entryPointPath).parse();

  if (apiGroups.length === 0) {
    return null;
  }

  const apiDomBuilder = new ApiDomBuilder(new JSDOM(), apiGroups);

  return new ApiComponentFactory(
    context,
    apiDomBuilder,
    new TsComponentAstPrinter()
  ).create();
};

export type GetComponent = (
  context: Context
) => Component | null | Promise<Component | null>;

export async function showcase(
  showcaseConfig: ValidatedShowcaseConfig,
  showcaseDir: string,
  getComponents: GetComponent[] = [getApiComponent, getReadmeComponent]
): Promise<void> {
  const outDir = createOutDir(
    showcaseConfig.componentOut,
    showcaseConfig.appOut
  );

  const components: Component[] = [];
  const ngModuleFiles: File[] = [];
  const componentFiles: File[] = [];
  const containerComponents: ContainerComponent[] = [];

  if (showcaseConfig.appOut) {
    writeApp(showcaseConfig.appOut);
  }

  const pushAndWrite = (
    showcaseComponent: Component,
    showcaseComponents: Component[]
  ) => {
    ngModuleFiles.push(showcaseComponent.ngModuleFile);
    componentFiles.push(showcaseComponent.componentFile);
    showcaseComponents.push(showcaseComponent);
    writeComponent(showcaseComponent, outDir);
  };

  const features = readFeatures(
    showcaseDir,
    showcaseConfig.featureGlob,
    showcaseConfig.featureIgnoreGlob
  );

  for (const feature of features) {
    const featureComponents: Component[] = [];

    const context = new Context(showcaseDir, feature.dir, showcaseConfig);

    for (const getComponent of getComponents) {
      const component = await getComponent(context);

      if (component) {
        pushAndWrite(component, components);
        featureComponents.push(component);
      }
    }

    const containerComponent = new ContainerComponentFactory(
      context,
      new ContainerDomBuilder(new JSDOM(), context, featureComponents),
      new TsComponentAstPrinter(),
      featureComponents
    ).create();

    if (containerComponent) {
      pushAndWrite(containerComponent, containerComponents);
    }

    writeCommonComponents({
      ngModuleFiles,
      components,
      componentFiles,
      containerComponents,
      showcaseConfig,
      outDir,
    });

    copySync(
      paths.internalComponents,
      join(outDir, directories.internalComponents)
    );
  }

  if (showcaseConfig.appOut) {
    await buildApp(showcaseConfig.appOut);
  }
}
