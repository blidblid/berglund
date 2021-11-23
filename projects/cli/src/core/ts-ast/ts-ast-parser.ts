import {
  createSourceFile,
  isCallExpression,
  isClassDeclaration,
  isDecorator,
  isIdentifier,
  ScriptTarget,
} from 'typescript';
import { TsAstData } from '../../commands/showcase/core/dom-builder-model';
import { chainTypeGuards, isSyntaxList } from './ts-ast-parser-util';

export class TsAstParser {
  parse(code: string): TsAstData | null {
    return (
      this.extractComponentFromAst(code) || this.extractNgModuleFromAst(code)
    );
  }

  private extractComponentFromAst(code: string): TsAstData | null {
    const className = this.getDecoratedClassName(code, 'Component');
    return className === null
      ? null
      : {
          decorator: 'component',
          className,
        };
  }

  private extractNgModuleFromAst(code: string): TsAstData | null {
    const className = this.getDecoratedClassName(code, 'NgModule');
    return className === null
      ? null
      : {
          decorator: 'module',
          className,
        };
  }

  private getDecoratedClassName(
    code: string,
    decoratorName: string
  ): string | null {
    const sourceFile = createSourceFile(
      'dummy.ts',
      code,
      ScriptTarget.Latest,
      true
    );

    const classDeclaration = chainTypeGuards(
      sourceFile,
      isSyntaxList,
      isClassDeclaration
    );

    if (!classDeclaration) {
      return null;
    }

    const decoratorIdentifier = chainTypeGuards(
      classDeclaration,
      isSyntaxList,
      isDecorator,
      isCallExpression,
      isIdentifier
    );

    if (decoratorIdentifier?.getText() !== decoratorName) {
      return null;
    }

    const classIdentifier = chainTypeGuards(classDeclaration, isIdentifier);

    if (!classIdentifier) {
      return null;
    }

    return classIdentifier.getText();
  }
}
