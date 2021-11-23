import {
  createPrinter,
  Decorator,
  Expression,
  factory as f,
  ImportDeclaration,
  ListFormat,
  Node,
  NodeFlags,
  ObjectLiteralExpression,
  SourceFile,
  VariableStatement,
} from 'typescript';
import { File } from '../../commands/showcase/core/dom-builder-model';

export class TsAstPrinter {
  protected printer = createPrinter();
  protected apiIdentifierName = 'API';

  protected createImportsFromRecord(
    record: Record<string, string[] | Set<string>>
  ): ImportDeclaration[] {
    return Object.entries(record).map(([key, value]) => {
      return this.createImportDeclaration(key, [...value]);
    });
  }

  protected printNodes(sourceFile: SourceFile, nodes: Node[]): string {
    return this.printer.printList(
      ListFormat.MultiLine,
      f.createNodeArray(nodes, true),
      sourceFile
    );
  }

  protected createObjectLiteralExpression(
    record: Record<string, object>
  ): ObjectLiteralExpression {
    return f.createObjectLiteralExpression(
      Object.entries(record).map(([key, value]) => {
        return f.createPropertyAssignment(
          f.createIdentifier(key),
          this.createExpression(value)
        );
      }),
      true
    );
  }

  protected createExpression(value: any): Expression {
    if (Array.isArray(value)) {
      return f.createArrayLiteralExpression(
        value.map((v) => this.createExpression(v))
      );
    }

    if (typeof value === 'object' && value !== null) {
      return this.createObjectLiteralExpression(value);
    }

    if (typeof value === 'string') {
      return f.createStringLiteral(value, true);
    }

    if (typeof value === 'number') {
      return f.createNumericLiteral(value);
    }

    if (typeof value === 'function') {
      return f.createIdentifier(value.name);
    }

    if (value === null) {
      return f.createNull();
    }

    throw new Error(`Could not create expression for ${value}.`);
  }

  protected createFileApiDeclaration(
    files: File[],
    identifierName = this.apiIdentifierName
  ): VariableStatement {
    return f.createVariableStatement(
      undefined,
      f.createVariableDeclarationList(
        [
          f.createVariableDeclaration(
            identifierName,
            undefined,
            undefined,
            f.createArrayLiteralExpression(
              files.map((file) => {
                return f.createIdentifier(file.className!);
              }),
              true
            )
          ),
        ],
        NodeFlags.Const
      )
    );
  }

  protected createFileImports(
    files: File[],
    getPath = (file: File) => file.localPath
  ): Record<string, string[]> {
    return files.reduce(
      (acc, file) => ({
        ...acc,
        [getPath(file)]: [file.className],
      }),
      {}
    );
  }

  protected createAngularDecorator(
    decoratorName: 'NgModule' | 'Component',
    decoratorExpression?: Expression[] | undefined
  ): Decorator {
    return f.createDecorator(
      f.createCallExpression(
        f.createIdentifier(decoratorName),
        undefined,
        decoratorExpression
      )
    );
  }

  protected createExportDeclarationFromString(relativePath: string) {
    return f.createExportDeclaration(
      undefined,
      undefined,
      false,
      undefined,
      f.createStringLiteral(relativePath, true)
    );
  }

  protected createImportDeclaration(
    packageName: string,
    imports: string[]
  ): ImportDeclaration {
    return f.createImportDeclaration(
      undefined,
      undefined,
      f.createImportClause(
        false,
        undefined,
        f.createNamedImports(
          imports.map((importName) =>
            f.createImportSpecifier(undefined, f.createIdentifier(importName))
          )
        )
      ),
      f.createStringLiteral(packageName, true)
    );
  }
}
