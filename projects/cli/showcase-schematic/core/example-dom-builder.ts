import { readdirSync, readFileSync } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import { File, TsAstParser } from '../../../core';
import { DomBuilder } from './dom-builder';

export class ExampleDomBuilder extends DomBuilder {
  constructor(protected jsdom: JSDOM, private tsAstParser: TsAstParser) {
    super(jsdom);
  }

  getDom(): JSDOM | null {
    return this.jsdom;
  }

  createExampleFiles(dirPath: string): File[] {
    const files: File[] = [];
    const fileNames = readdirSync(dirPath);

    for (const fileName of fileNames) {
      const filePath = join(dirPath, fileName);
      const content = readFileSync(filePath, 'utf-8');

      const astData = fileName.endsWith('.ts')
        ? this.tsAstParser.extractComponentFromAst(content) ?? this.tsAstParser.extractNgModuleFromAst(content)
        : null;

      files.push(
        this.createFile({
          id: fileName,
          fileName,
          content,
          className: astData?.className,
          decorator: astData?.decorator,
        })
      );
    }

    return files;
  }
}
