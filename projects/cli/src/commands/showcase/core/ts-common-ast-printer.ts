import { parse } from 'path';
import {
  factory,
  NodeFlags,
  ObjectLiteralExpression,
  SyntaxKind,
} from 'typescript';
import {
  createDummySourceFile,
  fileNames,
  pluck,
  RemoveIndex,
  toRelativePath,
  TsAstPrinter,
} from '../../../core';
import { ShowcaseConfig } from '../schemas/showcase/schema';
import { Component, ContainerComponent, File } from './dom-builder-model';

export class TsCommonAstPrinter extends TsAstPrinter {
  createIndexContent(typescriptFiles: File[]): string {
    const fromFileNames = [fileNames.sharedModule, fileNames.routes].map(
      (fileName) =>
        this.createExportDeclarationFromString(
          toRelativePath(parse(fileName).name)
        )
    );

    return this.printNodes(createDummySourceFile(), [
      ...fromFileNames,
      ...typescriptFiles.map((file) => {
        return this.createExportDeclarationFromString(file.relativePath);
      }),
    ]);
  }

  createSharedNgModuleContent(moduleFiles: File[]): string {
    const sourceFile = createDummySourceFile();

    const imports = this.createImportsFromRecord({
      '@angular/core': ['NgModule'],
      ...this.createFileImports(moduleFiles, (file) => file.relativePath),
    });

    const ngModuleApi = this.createFileApiDeclaration(moduleFiles);

    const decorator = this.createAngularDecorator('NgModule', [
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier('exports'),
            factory.createIdentifier(this.apiIdentifierName)
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('imports'),
            factory.createIdentifier(this.apiIdentifierName)
          ),
        ],
        true
      ),
    ]);

    const classDeclaration = factory.createClassDeclaration(
      [decorator],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      'SharedModule',
      undefined,
      undefined,
      []
    );

    return this.printNodes(sourceFile, [
      ...imports,
      ngModuleApi,
      classDeclaration,
    ]);
  }

  createRoutesContent(containerComponents: ContainerComponent[]): string {
    const sourceFile = createDummySourceFile();
    const componentFiles = containerComponents.reduce(
      (acc, containerComponent) => {
        return [
          ...acc,
          containerComponent.componentFile,
          ...pluck([...containerComponent.children], 'componentFile'),
        ];
      },
      []
    );

    const imports = this.createImportsFromRecord(
      this.createFileImports(componentFiles, (file) => file.relativePath)
    );

    const routes = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('ROUTES'),
            undefined,
            undefined,
            factory.createArrayLiteralExpression(
              createContainerRouteObjects(containerComponents),
              true
            )
          ),
        ],
        NodeFlags.Const
      )
    );

    function createContainerRouteObjects(
      components: ContainerComponent[]
    ): ObjectLiteralExpression[] {
      return components.map((component) => {
        const path =
          component.type === 'container'
            ? component.componentFile.id
            : component.type === 'main'
            ? ''
            : component.type;

        return factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('path'),
              factory.createStringLiteral(path, true)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('component'),
              factory.createIdentifier(component.componentFile.className ?? '')
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('children'),
              factory.createArrayLiteralExpression(
                createChildrenRouteObjects(component.children)
              )
            ),
          ],
          true
        );
      });
    }

    function createChildrenRouteObjects(
      components: Component[]
    ): ObjectLiteralExpression[] {
      if (components.length === 0) {
        return [];
      }

      const redirectRoutes = components.map((component) => {
        const path =
          component.type === 'container'
            ? component.componentFile.id
            : component.type;

        const lastType = components[components.length - 1].type;

        return factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('path'),
              factory.createStringLiteral(
                component.type === lastType ? '' : component.type,
                true
              )
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('pathMatch'),
              factory.createStringLiteral('full', true)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('redirectTo'),
              factory.createStringLiteral(
                `${path}/${component.titleIds[0] ?? ''}`,
                true
              )
            ),
          ],
          true
        );
      });

      const childComponentRoutes = components.map((component) => {
        const path =
          component.type === 'container'
            ? component.componentFile.id
            : component.type;

        return factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('path'),
              factory.createStringLiteral(`${path}/:id`, true)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier('component'),
              factory.createIdentifier(component.componentFile.className ?? '')
            ),
          ],
          true
        );
      });

      return [...redirectRoutes, ...childComponentRoutes];
    }

    return this.printNodes(sourceFile, [...imports, routes]);
  }

  createFeaturesContent(containerComponents: ContainerComponent[]): string {
    containerComponents = containerComponents.filter(
      (component) => component.type !== 'main'
    );

    const sourceFile = createDummySourceFile();
    const componentFiles = pluck(containerComponents, 'componentFile');
    const imports = this.createImportsFromRecord(
      this.createFileImports(componentFiles, (file) => file.relativePath)
    );

    const uncategorizedContainerComponents: ContainerComponent[] = [];

    const containerComponentsByCategory = containerComponents.reduce(
      (acc, curr) => {
        if (curr.category === undefined) {
          uncategorizedContainerComponents.push(curr);
          return acc;
        }

        if (acc[curr.category]) {
          acc[curr.category].push(curr);
        } else {
          acc[curr.category] = [curr];
        }

        return acc;
      },
      {} as Record<string, ContainerComponent[]>
    );

    const categorizedFeatures = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('CATEGORIZED_FEATURES'),
            undefined,
            undefined,
            factory.createArrayLiteralExpression(
              Object.entries(containerComponentsByCategory).map(
                ([category, components]) => {
                  return factory.createObjectLiteralExpression([
                    factory.createPropertyAssignment(
                      factory.createIdentifier('name'),
                      factory.createStringLiteral(category)
                    ),
                    factory.createPropertyAssignment(
                      factory.createIdentifier('features'),
                      createArrayLiteralExpressions(components)
                    ),
                  ]);
                }
              )
            )
          ),
        ],
        NodeFlags.Const
      )
    );

    const uncategorizedFeatures = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('UNCATEGORIZED_FEATURES'),
            undefined,
            undefined,
            createArrayLiteralExpressions(uncategorizedContainerComponents)
          ),
        ],
        NodeFlags.Const
      )
    );

    const features = factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier('FEATURES'),
            undefined,
            undefined,
            createArrayLiteralExpressions(containerComponents)
          ),
        ],
        NodeFlags.Const
      )
    );

    return this.printNodes(sourceFile, [
      ...imports,
      features,
      uncategorizedFeatures,
      categorizedFeatures,
    ]);

    function createArrayLiteralExpressions(components: ContainerComponent[]) {
      return factory.createArrayLiteralExpression(
        components.map((component) => {
          return factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier('id'),
                factory.createStringLiteral(component.componentFile.id, true)
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier('component'),
                factory.createIdentifier(
                  component.componentFile.className ?? ''
                )
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier('name'),
                factory.createStringLiteral(component.name, true)
              ),
            ],
            true
          );
        }),
        true
      );
    }
  }

  createShowcaseConfigContent(config: ShowcaseConfig): string {
    const writeConfig = {};
    const keysToWrite: (keyof RemoveIndex<ShowcaseConfig>)[] = [
      'name',
      'appExternalLinks',
    ];

    for (const key of keysToWrite) {
      writeConfig[key] = config[key] ?? null;
    }

    return `export const SHOWCASE_CONFIG = ${JSON.stringify(
      writeConfig,
      null,
      2
    )}`;
  }
}
