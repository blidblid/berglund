import { existsSync, writeFileSync } from 'fs';
import { copySync, ensureDirSync, mkdirSync } from 'fs-extra';
import { fileNames, paths } from '../../../core/constants';
import { join } from '../../../core/path';
import { replaceAngularSyntax } from '../../../core/util';
import { Component, ContainerComponent, File } from './dom-builder-model';
import { ValidatedShowcaseConfig } from './read';
import { TsCommonAstPrinter } from './ts-common-ast-printer';

export interface CommonComponents {
  ngModuleFiles: File[];
  componentFiles: File[];
  components: Component[];
  containerComponents: ContainerComponent[];
  showcaseConfig: ValidatedShowcaseConfig;
  outDir: string;
}

export interface FileWriter {
  api: (commonComponents: CommonComponents) => string;
  fileName: string;
}

export function writeCommonComponents(context: CommonComponents): void {
  const tsCommonAstPrinter = new TsCommonAstPrinter();

  const fileWriters: FileWriter[] = [
    {
      api: (c) =>
        tsCommonAstPrinter.createSharedNgModuleContent(c.ngModuleFiles),
      fileName: fileNames.sharedModule,
    },
    {
      api: (c) => tsCommonAstPrinter.createRoutesContent(c.containerComponents),
      fileName: fileNames.routes,
    },
    {
      api: (c) =>
        tsCommonAstPrinter.createIndexContent([
          ...c.componentFiles,
          ...c.ngModuleFiles,
        ]),
      fileName: fileNames.index,
    },
    {
      api: (c) =>
        tsCommonAstPrinter.createFeaturesContent(c.containerComponents),
      fileName: fileNames.features,
    },
    {
      api: (c) =>
        tsCommonAstPrinter.createShowcaseConfigContent(c.showcaseConfig),
      fileName: fileNames.showcaseConfigModule,
    },
  ];

  for (const fileWriter of fileWriters) {
    const path = join(context.outDir, fileWriter.fileName);
    writeFileSync(path, fileWriter.api(context));
  }
}

export function writeComponent(component: Component, dir: string): void {
  const subDir = join(dir, component.id);

  for (const file of component.files) {
    writeFile(file, subDir, file.extension === '.html');
  }

  for (const example of component.examples) {
    for (const file of example.files) {
      writeFile(file, subDir);
    }
  }
}

export function writeApp(path: string): void {
  copySync(paths.app, path, {
    filter: (src) => !src.includes('node_modules'),
  });
}

export function createOutDir(componentOut: string, appOut?: string): string {
  const outPath = appOut ? join(appOut, paths.appComponentOut) : componentOut;

  if (!existsSync(outPath)) {
    mkdirSync(outPath, { recursive: true });
  }

  return outPath;
}

function writeFile(file: File, dir: string, escape?: boolean): void {
  ensureDirSync(dir);

  writeFileSync(
    join(dir, file.fileName),
    escape ? replaceAngularSyntax(file.content) : file.content
  );
}
