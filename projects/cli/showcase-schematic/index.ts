import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { existsSync, mkdirSync } from 'fs';
import { JSDOM } from 'jsdom';
import { buildTemplates, File, fileNames } from '../../core';
import { getApiComponent, GetComponent, getEditorComponent, getReadmeComponent } from './components';
import { ContainerComponentFactory } from './components/container/container-component-factory';
import { ContainerDomBuilder } from './components/container/container-dom-builder';
import { Context } from './core/context';
import { Component, ContainerComponent } from './core/dom-builder-model';
import { readConfigs, readFeatures } from './core/read';
import { TsComponentAstPrinter } from './core/ts-component-ast-printer';
import { writeCommonComponents, writeComponent } from './core/write-components';
import { ShowcaseOptions } from './schemas/showcase/schema';

export default function (options: ShowcaseOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    if (options.init) {
      initWorkspace(tree, context);
    }

    for (const configFile of readConfigs<ShowcaseOptions>(fileNames.showcaseOptions)) {
      console.log(`Creating showcase components for ${configFile.dir}`);
      await generateFeature(tree, options, configFile.dir, [getApiComponent, getReadmeComponent, getEditorComponent]);
    }

    return buildTemplates('./files', options);
  };
}

export async function generateFeature(
  tree: Tree,
  showcaseOptions: ShowcaseOptions,
  showcaseDir: string,
  getComponents: GetComponent[]
): Promise<void> {
  if (!existsSync(showcaseOptions.componentOut)) {
    mkdirSync(showcaseOptions.componentOut, { recursive: true });
  }

  const components: Component[] = [];
  const ngModuleFiles: File[] = [];
  const componentFiles: File[] = [];
  const containerComponents: ContainerComponent[] = [];

  const pushAndWrite = (showcaseComponent: Component, showcaseComponents: Component[]) => {
    ngModuleFiles.push(showcaseComponent.ngModuleFile);
    componentFiles.push(showcaseComponent.componentFile);
    showcaseComponents.push(showcaseComponent);
    writeComponent(showcaseComponent, showcaseOptions.componentOut, tree);
  };

  const features = readFeatures(showcaseDir, showcaseOptions.featureGlob, showcaseOptions.featureIgnoreGlob);

  for (const feature of features) {
    const featureComponents: Component[] = [];
    const context = new Context(showcaseDir, feature.dir, showcaseOptions);

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

    writeCommonComponents(
      {
        ngModuleFiles,
        components,
        componentFiles,
        containerComponents,
        context,
        outDir: showcaseOptions.componentOut,
      },
      tree
    );
  }
}

// Monkey patch JSDOM to support the non-standard characters
// that are used in Angular attributes.
// https://github.com/jsdom/jsdom/issues/2477
(function monkeyPatch() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const validateNames = require('jsdom/lib/jsdom/living/helpers/validate-names.js');
  const qname_ = validateNames.qname;
  validateNames.qname = (name: string) => {
    try {
      qname_(name);
    } catch {} // eslint-disable-line no-empty
  };
})();

function initWorkspace(tree: Tree, context: SchematicContext): void {
  const dependencies = { prismjs: '^1.17.1' };

  for (const [name, version] of Object.entries(dependencies)) {
    addPackageJsonDependency(tree, { type: NodeDependencyType.Default, version, name });
  }

  context.addTask(new NodePackageInstallTask());
}
