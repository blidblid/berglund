import { existsSync, readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { fileNames, TsAstParser } from '../../core';
import { join } from '../../core/util/posix-path';
import { ApiComponentFactory } from './components/api/api-component-factory';
import { ApiDomBuilder } from './components/api/api-dom-builder';
import { TsdocAstParser } from './components/api/tsdoc-ast-parser';
import { EditorComponentFactory } from './components/editor/editor-component-factory';
import { EditorDomBuilder } from './components/editor/editor-dom-builder';
import { ReadmeComponentFactory } from './components/readme/readme-component-factory';
import { ReadmeDomBuilder } from './components/readme/readme-dom-builder';
import { Context } from './core/context';
import { Component } from './core/dom-builder-model';
import { ExampleDomBuilder } from './core/example-dom-builder';
import { TsComponentAstPrinter } from './core/ts-component-ast-printer';

export type GetComponent = (context: Context) => Component | null | Promise<Component | null>;

export const getReadmeComponent = (context: Context) => {
  const readmePath = join(context.featureDir, context.featureOptions.readmePath || fileNames.readmeMd);

  if (!existsSync(readmePath)) {
    return null;
  }

  const html = marked(readFileSync(readmePath, 'utf-8'));
  const jsDom = new JSDOM(html);

  return new ReadmeComponentFactory(
    context,
    new ReadmeDomBuilder(jsDom, context, new ExampleDomBuilder(jsDom, new TsAstParser())),
    new TsComponentAstPrinter()
  ).create();
};

export const getEditorComponent = (context: Context) => {
  const jsDom = new JSDOM();

  return new EditorComponentFactory(
    context,
    new EditorDomBuilder(jsDom),
    new TsComponentAstPrinter(),
    new ExampleDomBuilder(jsDom, new TsAstParser())
  ).create();
};

export const getApiComponent = async (context: Context) => {
  const entryPointPath = join(context.featureDir, context.featureOptions.entryPointPath ?? fileNames.index);

  if (!existsSync(entryPointPath)) {
    return null;
  }

  const apiGroups = await new TsdocAstParser(context, entryPointPath).parse();

  if (apiGroups.length === 0) {
    return null;
  }

  const apiDomBuilder = new ApiDomBuilder(new JSDOM(), apiGroups);

  return new ApiComponentFactory(context, apiDomBuilder, new TsComponentAstPrinter()).create();
};
