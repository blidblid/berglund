import { exec } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { copySync, emptyDirSync, ensureDirSync, mkdirSync } from 'fs-extra';
import { promisify } from 'util';
import { fileNames, paths } from '../../../core/constants';
import { join } from '../../../core/path';
import { replaceAngularSyntax, toPosixPath } from '../../../core/util';
import { Context } from './context';
import { Component, ContainerComponent, File } from './dom-builder-model';
import { TsCommonAstPrinter } from './ts-common-ast-printer';

const promiseExec = promisify(exec);

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

export function writeCommonComponents(components: CommonComponents): void {
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
      api: (c) => tsCommonAstPrinter.createShowcaseConfigContent(c.context),
      fileName: fileNames.showcaseConfigModule,
    },
  ];

  for (const fileWriter of fileWriters) {
    const path = join(components.outDir, fileWriter.fileName);
    writeFileSync(path, fileWriter.api(components));
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
    filter: (src) => {
      return (
        !src.includes('node_modules') &&
        !toPosixPath(src).includes(paths.appComponentOut)
      );
    },
  });
}

export async function buildApp(path: string): Promise<void> {
  await promiseExec('ng b', { cwd: path });
}

export function createOutDir(componentOut: string, appOut?: string): string {
  const outPath = appOut ? join(appOut, paths.appComponentOut) : componentOut;

  if (appOut) {
    emptyDirSync(outPath);
  }

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
