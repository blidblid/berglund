import { factory, SyntaxKind } from 'typescript';
import { createDummySourceFile, File, TsAstPrinter } from '../../../core';

export class TsComponentAstPrinter extends TsAstPrinter {
  createComponentContent(
    id: string,
    className: string,
    templateUrl: string,
    files: File[] = [],
    titleIds: string[] = []
  ) {
    const sourceFile = createDummySourceFile();
    const componentFiles = files.filter(file => file.decorator === 'component');

    const imports = this.createImportsFromRecord({
      '@angular/core': ['Component', 'ChangeDetectionStrategy', 'ViewEncapsulation'],
      '../showcase-component-base': ['BergShowcaseBase'],
      ...this.createFileImports(componentFiles),
    });

    const decorator = this.createAngularDecorator('Component', [
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier('templateUrl'),
            factory.createStringLiteral(templateUrl, true)
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('changeDetection'),
            factory.createPropertyAccessExpression(
              factory.createIdentifier('ChangeDetectionStrategy'),
              factory.createIdentifier('OnPush')
            )
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('encapsulation'),
            factory.createPropertyAccessExpression(
              factory.createIdentifier('ViewEncapsulation'),
              factory.createIdentifier('None')
            )
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('interpolation'),
            factory.createArrayLiteralExpression([
              factory.createStringLiteral('[{[{'),
              factory.createStringLiteral('}]}]'),
            ])
          ),
        ],
        true
      ),
    ]);

    const componentMembers = [
      factory.createPropertyDeclaration(
        undefined,
        undefined,
        'id',
        undefined,
        undefined,
        factory.createStringLiteral(id)
      ),
      factory.createPropertyDeclaration(
        undefined,
        undefined,
        'titleIds',
        undefined,
        undefined,
        factory.createArrayLiteralExpression(titleIds.map(titleId => factory.createStringLiteral(titleId, true)))
      ),
      ...componentFiles.map(file => {
        return factory.createPropertyDeclaration(
          undefined,
          undefined,
          file.className ?? '',
          undefined,
          undefined,
          factory.createIdentifier(file.className ?? '')
        );
      }),
    ];

    const classDeclaration = factory.createClassDeclaration(
      [decorator],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      className,
      undefined,
      [
        factory.createHeritageClause(SyntaxKind.ExtendsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier('BergShowcaseBase'), undefined),
        ]),
      ],
      componentMembers
    );

    return this.printNodes(sourceFile, [...imports, classDeclaration]);
  }

  createNgModuleContent(className: string, componentFile: File, exampleFiles: File[] = []): string {
    const sourceFile = createDummySourceFile();
    const moduleFiles = exampleFiles.filter(file => file.decorator === 'module');

    const importRecord = {
      '@angular/common': ['CommonModule'],
      '@angular/core': ['NgModule'],
      '@angular/router': ['RouterModule'],
      '@cambio/lib-material-ui/button': ['MatButtonModule'],
      '@cambio/lib-material-ui/card': ['MatCardModule'],
      '@cambio/lib-material-ui/icon': ['MatIconModule'],
      '@cambio/lib-material-ui/list': ['MatListModule'],
      '@cambio/lib-material-ui/tabs': ['MatTabsModule'],
      '../intersection': ['BergIntersectionModule'],
      '../code-highlighter': ['BergHighlightCodeModule'],
      '../component-editor': ['AtComponentEditorModule'],
      ...this.createFileImports([...moduleFiles, componentFile]),
    };

    const imports = this.createImportsFromRecord(importRecord);

    const moduleImports = [
      ...importRecord['@angular/common'],
      ...importRecord['@angular/router'],
      ...importRecord['@cambio/lib-material-ui/button'],
      ...importRecord['@cambio/lib-material-ui/card'],
      ...importRecord['@cambio/lib-material-ui/icon'],
      ...importRecord['@cambio/lib-material-ui/list'],
      ...importRecord['@cambio/lib-material-ui/tabs'],
      ...importRecord['../intersection'],
      ...importRecord['../code-highlighter'],
      ...importRecord['../component-editor'],
    ];

    const ngModuleApi = this.createFileApiDeclaration(moduleFiles.map(file => file.className!));

    const decorator = this.createAngularDecorator('NgModule', [
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment(
            factory.createIdentifier('declarations'),
            factory.createArrayLiteralExpression([factory.createIdentifier(componentFile.className ?? '')])
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('exports'),
            factory.createArrayLiteralExpression([
              factory.createSpreadElement(factory.createIdentifier(this.apiIdentifierName)),
              factory.createIdentifier(componentFile.className ?? ''),
            ])
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('imports'),
            factory.createArrayLiteralExpression([
              factory.createSpreadElement(factory.createIdentifier(this.apiIdentifierName)),
              ...moduleImports.map(name => factory.createIdentifier(name)),
            ])
          ),
        ],
        true
      ),
    ]);

    const classDeclaration = factory.createClassDeclaration(
      [decorator],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      className,
      undefined,
      undefined,
      []
    );

    return this.printNodes(sourceFile, [...imports, ngModuleApi, classDeclaration]);
  }
}
