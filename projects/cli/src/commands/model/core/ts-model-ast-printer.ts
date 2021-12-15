import { MixinComponent } from '@berglund/mixins';
import {
  isJsonSchema,
  MixinComponentGenerator,
} from '@berglund/mixins/generators';
import { JSONSchema7 } from 'json-schema';
import { factory, NodeFlags, SyntaxKind } from 'typescript';
import { createDummySourceFile, TsAstPrinter } from '../../../core';
import { ResolvedSchema } from './schema-resolver-model';

export class TsModelAstPrinter extends TsAstPrinter {
  printComponents(
    resolvedSchema: ResolvedSchema,
    generators: MixinComponentGenerator[]
  ): string {
    const imports: Record<string, Set<string>> = {};

    const nodes = this.getNamedSchemas(resolvedSchema.schema).map(
      (namedSchema) => {
        const components = this.createComponentsAndAddImports(
          namedSchema.schema,
          namedSchema.typeName,
          imports,
          generators
        );

        return factory.createVariableStatement(
          [factory.createModifier(SyntaxKind.ExportKeyword)],
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier(namedSchema.typeName),
                undefined,
                undefined,
                this.createObjectLiteralExpression(components)
              ),
            ],
            NodeFlags.Const
          )
        );
      }
    );

    return this.printNodes(createDummySourceFile(), [
      ...this.createImportsFromRecord(imports),
      ...nodes,
    ]);
  }

  private getNamedSchemas(schema: JSONSchema7) {
    const namedSchemas = schema.definitions
      ? Object.entries(schema.definitions)
          .filter((entries): entries is [string, JSONSchema7] => {
            return isJsonSchema(entries[1]);
          })
          .map(([typeName, schema]) => ({ schema, typeName }))
      : [];

    if (schema.type) {
      if (schema.title) {
        namedSchemas.push({ schema: schema, typeName: schema.title });
      } else {
        throw new Error('Top level schemas missing title.');
      }
    }

    return namedSchemas;
  }

  private createComponentsAndAddImports(
    schema: JSONSchema7,
    typeName: string,
    imports: Record<string, Set<string>>,
    generators: MixinComponentGenerator[],
    parentSchema?: JSONSchema7
  ): Record<string, MixinComponent> {
    return generators.reduce((acc, generator) => {
      const generated = generator(schema, { key: typeName, parentSchema });

      if (generated === null) {
        return acc;
      }

      const className = generated.mixinComponent.component.name;
      acc[className] = generated.mixinComponent;

      if (imports[generated.packageName]) {
        imports[generated.packageName].add(className);
      } else {
        imports[generated.packageName] = new Set([className]);
      }

      return acc;
    }, {} as Record<string, MixinComponent>);
  }
}
