import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { removeSync } from 'fs-extra';
import { dirname } from 'path';
import * as TypeDoc from 'TypeDoc';
import { fileNames, join, paths, resolve } from '../../../../core';
import { Context } from '../../core/context';
import { ApiExtractor, ApiGroup, ApiItem, ApiNode, ApiNodeType, TsdocSyntaxKind } from './tsdoc-ast-parser-model';

export class TsdocAstParser {
  private app = new TypeDoc.Application();

  private extractNgModule = this.extractDirectiveByDecorator('NgModule');
  private extractComponent = this.extractDirectiveByDecorator('Component');
  private extractPipe = this.extractDirectiveByDecorator('Pipe');
  private extractDirective = this.extractDirectiveByDecorator('Directive');

  private extractors: ApiExtractor[] = [
    {
      title: 'Components',
      getNode: (node: any) => this.extractComponent(node),
    },
    {
      title: 'Directives',
      getNode: (node: any) => this.extractDirective(node),
    },
    { title: 'Pipes', getNode: (node: any) => this.extractPipe(node) },
    { title: 'NgModules', getNode: (node: any) => this.extractNgModule(node) },
    { title: 'Classes', getNode: (node: any) => this.extractClass(node) },
    {
      title: 'Functions',
      getNode: (node: any) => this.extractFunction(node),
      isCompact: true,
    },
    {
      title: 'Variables',
      getNode: (node: any) => this.extractVariable(node),
      isCompact: true,
    },
    {
      title: 'Interfaces',
      getNode: (node: any) => this.extractInterface(node),
    },
    {
      title: 'Types',
      getNode: (node: any) => this.extractType(node),
      isCompact: true,
    },
  ];

  constructor(private context: Context, private entryPointPath: string) {
    this.app.options.addReader(new TypeDoc.TSConfigReader());
    this.app.options.addReader(new TypeDoc.TypeDocReader());
  }

  async parse(): Promise<ApiGroup[]> {
    const apiJson = await this.getApiJson();

    if (!apiJson) {
      return [];
    }

    const groups = this.extractors.reduce((acc, extractor) => {
      return {
        ...acc,
        [extractor.title]: { ...extractor, nodes: [] },
      };
    }, {} as Record<string, ApiGroup>);

    const nodes = Array.isArray(apiJson.children) ? apiJson.children : [];

    for (const node of nodes) {
      for (const extractor of this.extractors) {
        const extractedNode = extractor.getNode(node);

        if (extractedNode && !extractedNode.name.startsWith('_')) {
          groups[extractor.title].nodes.push(extractedNode);
          break;
        }
      }
    }

    return Object.values(groups).filter(group => group.nodes.length > 0);
  }

  private getComment(node: any): string | undefined {
    if (!node) {
      return undefined;
    }

    if (node.comment?.shortText) {
      const tags = Array.isArray(node.comment?.tags) ? node.comment?.tags.map((tag: any) => ` ${tag.text}`) : '';

      return `${node.comment.shortText} ${tags}`;
    }

    if (!Array.isArray(node.signatures)) {
      return undefined;
    }

    for (const signature of node.signatures) {
      const signatureComment = this.getComment(signature);
      if (signatureComment) {
        return signatureComment;
      }
    }
  }

  private stringifyNodeType(node: any): string {
    if (node.type) {
      return this.stringifyTypeNodeType(node.type);
    }

    const accessorSignature =
      (node.setSignature && node.setSignature[0] && node.setSignature[0].parameters[0]) ||
      (node.getSignature && node.getSignature[0]);

    if (accessorSignature) {
      return this.stringifyTypeNodeType(accessorSignature.type);
    }

    return 'any';
  }

  private stringifyTypeNodeType(typeNode: any, parenthesis?: boolean): string {
    if (!typeNode) {
      return '';
    }

    if (typeNode.type === 'reference') {
      return `${typeNode.name}${this.stringifyTypeNodeGeneric(typeNode)}`;
    }

    if (typeNode.type === 'literal') {
      const delimiter = typeof typeNode.value === 'string' ? "'" : '';
      return `${delimiter}${typeNode.value}${delimiter}`;
    }

    if (typeNode.type === 'intrinsic') {
      return typeNode.name;
    }

    if (typeNode.operator) {
      return `${typeNode.operator} ${this.stringifyTypeNodeType(typeNode.target)}`;
    }

    if (typeNode.type === 'intersection') {
      return this.joinTypes(typeNode, '&', parenthesis);
    }

    if (typeNode.type === 'union') {
      return this.joinTypes(typeNode, '|', parenthesis);
    }

    if (typeNode.type === 'predicate') {
      return `${typeNode.name} is ${this.stringifyTypeNodeType(typeNode.targetType)}`;
    }

    if (typeNode.type === 'array') {
      return `${this.stringifyTypeNodeType(typeNode.elementType, true)}[]`;
    }

    if (typeNode.type === 'mapped') {
      return `{ [${typeNode.parameter} in ${this.stringifyTypeNodeType(
        typeNode.parameterType
      )}]: ${this.stringifyTypeNodeType(typeNode.templateType)} }`;
    }

    if (typeNode.type === 'query') {
      return this.stringifyTypeNodeType(typeNode.queryType);
    }

    if (typeNode.type === 'indexedAccess') {
      return `${this.stringifyTypeNodeType(typeNode.objectType)}[${this.stringifyTypeNodeType(typeNode.indexType)}]`;
    }

    if (Array.isArray(typeNode.declaration?.signatures)) {
      const signatures = this.createFunctionSignatures(typeNode.declaration);
      if (signatures.length > 0) {
        return signatures.join('\n');
      }
    }

    if (typeNode.type === 'reflection') {
      return '';
    }

    throw Error('Unknown type ' + JSON.stringify(typeNode));
  }

  private stringifyTypeNodeGeneric(typeNode: any): string {
    if (!Array.isArray(typeNode.typeArguments)) {
      return '';
    }

    return `<${typeNode.typeArguments.map((tn: any) => this.stringifyTypeNodeType(tn)).join(', ')}>`;
  }

  private createFunctionSignatures(node: any): string[] {
    if (!Array.isArray(node.signatures)) {
      return [];
    }

    return node.signatures.reduce((acc: any, signature: any) => {
      return [...acc, this.createFunctionSignature(signature.parameters, this.stringifyNodeType(signature))];
    }, []);
  }

  private createFunctionSignature(parameters: any[], returnType: string): string {
    parameters = Array.isArray(parameters) ? parameters : [];

    // use typedoc named types over creating an AST
    return `(${parameters
      .map(parameter => this.getItemName(parameter.name, this.stringifyNodeType(parameter)))
      .join(', ')}) => ${returnType};`;
  }

  private extractClass(node: any): ApiNode | null {
    if (node.kind !== TsdocSyntaxKind.Class) {
      return null;
    }

    return {
      type: 'Class',
      ...this.extractCommon(node),
    };
  }

  private extractInterface(node: any): ApiNode | null {
    if (node.kind !== TsdocSyntaxKind.Interface) {
      return null;
    }

    return {
      type: 'Interface',
      ...this.extractCommon(node),
    };
  }

  private extractVariable(node: any): ApiNode | null {
    if (node.kind !== TsdocSyntaxKind.Variable) {
      return null;
    }

    return {
      type: 'Variable',
      ...this.extractCommon(node),
      name: `${node.flags.isConst ? 'const' : 'let'} ${node.name} = ${this.stringifyNodeType(node)}`,
    };
  }

  private extractType(node: any): ApiNode | null {
    if (node.kind !== TsdocSyntaxKind.TypeAlias) {
      return null;
    }

    return {
      type: 'Type',
      ...this.extractCommon(node),
      name: `type ${node.name} = ${this.stringifyNodeType(node)}`,
    };
  }

  private extractFunction(node: any): ApiNode | null {
    if (node.kind !== TsdocSyntaxKind.Function) {
      return null;
    }

    return {
      type: 'Function',
      ...this.extractCommon(node),
      name: this.createFunctionSignatures(node)
        .map(signature => `${node.name}:  ${signature}`)
        .join('\n'),
    };
  }

  private extractDirectiveByDecorator(type: ApiNodeType): (node: any) => ApiNode | null {
    return node => {
      if (node.kind !== TsdocSyntaxKind.Class) {
        return null;
      }

      const decoratorNode = this.getDecoratorNode(node, type);

      if (!decoratorNode) {
        return null;
      }

      return {
        ...this.extractCommon(node),
        type,
        selector: this.getAngularSelector(decoratorNode),
      };
    };
  }

  private getAngularSelector(decoratorNode: any): string | undefined {
    if (!decoratorNode.arguments?.obj) {
      return;
    }

    const match = /(.?selector.?: ?'|")(.*?)(?=('|")(,|}))/g.exec(decoratorNode.arguments.obj);

    if (!match || !match[2]) {
      return;
    }

    return match[2].trim();
  }

  private getSourceUrl(node: any): string | undefined {
    if (!this.context.showcaseOptions.repositoryUrl || !this.context.relativeGitUrl) {
      return;
    }

    const source = Array.isArray(node.sources) ? node.sources[0] : null;

    if (!source) {
      return;
    }

    return `${join(this.context.showcaseOptions.repositoryUrl, this.context.relativeGitUrl, source.fileName)}#${
      source.line
    }`;
  }

  private getDecoratorNode(node: any, decorator: string): any | null {
    return (
      Array.isArray(node.decorators) &&
      node.decorators.find((d: any) => {
        return d.name === decorator && d.type.name === decorator;
      })
    );
  }

  private extractCommon(node: any): Pick<ApiNode, 'name' | 'sourceUrl' | 'description' | 'items'> {
    const items: ApiItem[] = node?.children?.map((node: any) => this.extractItem(node)).filter((item: any) => !!item);

    return {
      name: node.name,
      description: this.getComment(node),
      sourceUrl: this.getSourceUrl(node),
      items: items,
    };
  }

  private extractItem(node: any): ApiItem | null {
    if (node.name && node.name.startsWith('_')) {
      return null;
    }

    if (node.kind === TsdocSyntaxKind.Property || node.kind === TsdocSyntaxKind.Accessor) {
      const type = this.stringifyNodeType(node);
      const isInput = !!this.getDecoratorNode(node, 'Input');
      const isOutput = !!this.getDecoratorNode(node, 'Output');
      const name = this.getItemName(node.name, type);

      return {
        type,
        description: this.getComment(node),
        nodeType: isInput ? '@Input()' : isOutput ? '@Output()' : 'Property',
        name: this.context.featureOptions.webComponent && isInput ? this.camelCaseToKebabCase(name) : name,
      };
    }

    if (node.kind === TsdocSyntaxKind.Method) {
      const type = this.createFunctionSignatures(node);
      return {
        name: this.getItemName(node.name, type.join(' | ')),
        type,
        description: this.getComment(node),
        nodeType: 'Method',
      };
    }

    return null;
  }

  private async getApiJson() {
    if (!existsSync(this.entryPointPath)) {
      return null;
    }

    console.log(`Running TypeDoc for entry point ${this.entryPointPath}`);

    removeSync(paths.temp);
    mkdirSync(paths.temp, { recursive: true });

    const tsconfigPath = this.resolveTsConfig(this.context.featureDir);
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

    tsconfig.include = [this.entryPointPath];

    const typedocTsconfigPath = join(dirname(tsconfigPath), fileNames.typedocTsconfig);
    writeFileSync(typedocTsconfigPath, JSON.stringify(tsconfig, null, 2));

    const options: Partial<TypeDoc.TypeDocOptions> = {
      entryPoints: [this.entryPointPath],
      readme: undefined,
      excludePrivate: true,
      excludeProtected: true,
      tsconfig: typedocTsconfigPath,
      pretty: false,
    };

    this.app.bootstrap(options);
    const project = this.app.convert();

    if (!project) {
      return null;
    }

    const tempApiJsonPath = join(paths.temp, fileNames.apiJson);

    await this.app.generateJson(project, tempApiJsonPath);

    console.log('\n');

    return JSON.parse(readFileSync(tempApiJsonPath, 'utf-8'));
  }

  private getItemName(name: string, type?: string): string {
    return type ? `${name}: ${type}` : `${name}`;
  }

  private parenthesize(str: string): string {
    return `(${str})`;
  }

  private camelCaseToKebabCase(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  private joinTypes(typeNode: any, token: string, parenthesis?: boolean): string {
    const type = [...typeNode.types]
      .reverse()
      .map(node => this.stringifyTypeNodeType(node))
      .join(` ${token} `);

    return parenthesis && typeNode.types.length > 1 ? this.parenthesize(type) : type;
  }

  private resolveTsConfig(path: string): string {
    if (path.length === 0) {
      throw new Error(`Could not resolve ${fileNames.tsconfig}`);
    }

    const tsConfigPath = join(path, fileNames.tsconfig);
    if (existsSync(tsConfigPath)) {
      return tsConfigPath;
    }

    return this.resolveTsConfig(resolve(path, '..'));
  }
}
