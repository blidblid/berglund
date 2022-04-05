import { existsSync, lstatSync } from 'fs';
import {
  addSyntheticLeadingComment,
  addSyntheticTrailingComment,
  createPrinter,
  factory,
  ImportSpecifier,
  isClassDeclaration,
  isImportClause,
  isImportDeclaration,
  isImportSpecifier,
  isNamedImports,
  Node,
  Printer,
  SourceFile,
  SyntaxKind,
  transform,
  TransformationContext,
  TransformationResult,
  visitEachChild,
  visitNode,
} from 'typescript';
import { createDummySourceFile, File, findAllNodes, findFirstNode, join, prefixes } from '../../../../core';
import { ComponentFactory } from '../../core/component-factory';
import { Context } from '../../core/context';
import { Component, ExampleComponent, ShowcaseComponentType } from '../../core/dom-builder-model';
import { ExampleDomBuilder } from '../../core/example-dom-builder';
import { TsComponentAstPrinter } from '../../core/ts-component-ast-printer';
import { EditorDomBuilder } from './editor-dom-builder';

export class EditorComponentFactory extends ComponentFactory {
  protected idPrefix = prefixes.editorComponent;
  protected showcaseComponentType: ShowcaseComponentType = 'editor';

  constructor(
    protected context: Context,
    protected editorDomBuilder: EditorDomBuilder,
    protected tsComponentAstPrinter: TsComponentAstPrinter,
    private exampleDomBuilder: ExampleDomBuilder
  ) {
    super(context, editorDomBuilder, tsComponentAstPrinter);
  }

  create(): Component | null {
    if (!this.context.featureOptions.editorPath) {
      return null;
    }

    const editorPath = join(this.context.featureDir, this.context.featureOptions.editorPath);

    if (!existsSync(editorPath) || !lstatSync(editorPath).isDirectory()) {
      return null;
    }

    const exampleComponent: ExampleComponent = {
      containerElement: this.domBuilder.left,
      files: this.exampleDomBuilder.createExampleFiles(editorPath),
    };

    exampleComponent.files = exampleComponent.files.map(file => {
      return this.transformEditorComponent(file, exampleComponent.files);
    });

    this.editorDomBuilder.insertEditorComponent(exampleComponent);

    return this.createComponent([exampleComponent]);
  }

  private transformEditorComponent(file: File, files: File[]): File {
    if (file.decorator !== 'component') {
      return file;
    }

    const sourceFile = createDummySourceFile(file.content);
    const classDeclaration = findFirstNode(sourceFile, isClassDeclaration);

    if (!classDeclaration) {
      return file;
    }

    const editorComponentTransformer = <T extends Node>(context: TransformationContext) => {
      return (rootNode: T) => {
        const visit = (node: Node): Node => {
          node = visitEachChild(node, visit, context);

          if (isImportDeclaration(node)) {
            if (node.moduleSpecifier.getText() === "'@angular/core'") {
              const importSpecifiers: ImportSpecifier[] = findAllNodes(
                node,
                isImportClause,
                isNamedImports,
                isImportSpecifier
              );

              if (importSpecifiers.every(importSpecifier => importSpecifier.getText() !== "'ViewChild'")) {
                const importClause = factory.createImportClause(
                  false,
                  undefined,
                  factory.createNamedImports([
                    ...importSpecifiers,
                    factory.createImportSpecifier(false, undefined, factory.createIdentifier('ViewChild')),
                  ])
                );

                return factory.updateImportDeclaration(
                  node,
                  node.decorators,
                  node.modifiers,
                  importClause,
                  node.moduleSpecifier,
                  node.assertClause
                );
              }
            }
          }

          if (isClassDeclaration(node)) {
            const codeMember = factory.createPropertyDeclaration(
              undefined,
              undefined,
              factory.createIdentifier('code'),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                files.map(file => {
                  if (file.decorator === 'module') {
                    return factory.createPropertyAssignment(
                      factory.createIdentifier('ngModule'),
                      factory.createStringLiteral(file.content)
                    );
                  }

                  return factory.createPropertyAssignment(
                    factory.createIdentifier(file.extensionName),
                    factory.createStringLiteral(file.content)
                  );
                }),
                true
              )
            );

            const viewChildMember = factory.createPropertyDeclaration(
              [
                factory.createDecorator(
                  factory.createCallExpression(factory.createIdentifier('ViewChild'), undefined, [
                    factory.createStringLiteral('edit'),
                    factory.createObjectLiteralExpression(
                      [factory.createPropertyAssignment(factory.createIdentifier('static'), factory.createTrue())],
                      false
                    ),
                  ])
                ),
              ],
              undefined,
              factory.createIdentifier('instance'),
              undefined,
              factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
              undefined
            );

            const editorMembers = [codeMember, viewChildMember];

            if (this.context.featureOptions.editorSchema) {
              const schemaMember = factory.createPropertyDeclaration(
                undefined,
                undefined,
                factory.createIdentifier('schema'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('JSON'),
                    factory.createIdentifier('parse')
                  ),
                  undefined,
                  [factory.createStringLiteral(JSON.stringify(this.context.featureOptions.editorSchema))]
                )
              );

              editorMembers.push(schemaMember);
            }

            addSyntheticLeadingComment(editorMembers[0], SyntaxKind.SingleLineCommentTrivia, 'start-trim');
            addSyntheticTrailingComment(
              editorMembers[editorMembers.length - 1],
              SyntaxKind.SingleLineCommentTrivia,
              'end-trim'
            );

            return factory.updateClassDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.name,
              node.typeParameters,
              node.heritageClauses,
              [...node.members, ...editorMembers]
            );
          }

          return node;
        };

        return visitNode(rootNode, visit);
      };
    };

    const printer: Printer = createPrinter();
    const result: TransformationResult<SourceFile> = transform<SourceFile>(sourceFile, [editorComponentTransformer]);

    const transformedSourceFile: SourceFile = result.transformed[0];
    const content = printer.printFile(transformedSourceFile);

    return {
      ...file,
      content,
    };
  }
}
