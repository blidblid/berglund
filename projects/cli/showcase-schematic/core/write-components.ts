import { Tree } from '@angular-devkit/schematics';
import { File, fileNames, join, replaceAngularSyntax } from '../../../core';
import { Context } from './context';
import { Component, ContainerComponent } from './dom-builder-model';
import { TsCommonAstPrinter } from './ts-common-ast-printer';

export interface CommonComponents {
  ngModuleFiles: File[];
  componentFiles: File[];
  components: Component[];
  containerComponents: ContainerComponent[];
  context: Context;
  outDir: string;
}

export interface FileWriter {
  api: (commonComponents: CommonComponents) => string;
  fileName: string;
}

export function writeCommonComponents(components: CommonComponents, tree: Tree): void {
  const tsCommonAstPrinter = new TsCommonAstPrinter();

  const fileWriters: FileWriter[] = [
    {
      api: c => tsCommonAstPrinter.createSharedNgModuleContent(c.ngModuleFiles),
      fileName: fileNames.sharedModule,
    },
    {
      api: c => tsCommonAstPrinter.createRoutesContent(c.containerComponents),
      fileName: fileNames.routes,
    },
    {
      api: c => tsCommonAstPrinter.createIndexContent([...c.componentFiles, ...c.ngModuleFiles]),
      fileName: fileNames.index,
    },
    {
      api: c => tsCommonAstPrinter.createFeaturesContent(c.containerComponents),
      fileName: fileNames.features,
    },
    {
      api: c => tsCommonAstPrinter.createShowcaseConfigContent(c.context),
      fileName: fileNames.showcaseConfigModule,
    },
  ];

  for (const fileWriter of fileWriters) {
    const path = join(components.outDir, fileWriter.fileName);
    writeToTree(tree, path, fileWriter.api(components));
  }
}

export function writeComponent(component: Component, dir: string, tree: Tree): void {
  const subDir = join(dir, component.id);

  for (const file of component.files) {
    writeFile(file, subDir, tree, file.extension === '.html');
  }

  for (const example of component.examples) {
    for (const file of example.files) {
      writeFile(file, subDir, tree);
    }
  }
}

function writeFile(file: File, dir: string, tree: Tree, escape?: boolean): void {
  const content = escape ? replaceAngularSyntax(file.content) : file.content;
  writeToTree(tree, join(dir, file.fileName), content);
}

function writeToTree(tree: Tree, path: string, content: string): void {
  if (!tree.exists(path)) {
    tree.create(path, content);
  } else {
    tree.overwrite(path, content);
  }
}
