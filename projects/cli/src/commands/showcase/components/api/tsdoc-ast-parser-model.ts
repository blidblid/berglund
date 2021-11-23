export interface ApiExtractor {
  title: string;
  getNode: (node: any) => ApiNode | null;
  isCompact?: boolean;
}

export interface ApiNode {
  name: string;
  selector?: string;
  description?: string;
  type: ApiNodeType;
  items?: ApiItem[];
  sourceUrl?: string;
}

export type ApiNodeType =
  | 'Function'
  | 'Interface'
  | 'Variable'
  | 'Type'
  | 'Class'
  | 'Directive'
  | 'Component'
  | 'Pipe'
  | 'NgModule';

export type ApiItem = ApiPropertyItem | ApiMethodItem | ApiFunctionItem;

export type ApiMethodItemType = 'Method';

export type ApiFunctionItemType = 'Function';

export type ApiPropertyItemType = '@Input()' | '@Output()' | 'Property';

export interface ApiFunctionItem {
  signature: string;
  nodeType: ApiFunctionItemType;
  description?: string;
}

export interface ApiPropertyItem {
  name: string;
  nodeType: ApiPropertyItemType;
  type: string;
  description?: string;
}

export interface ApiMethodItem {
  name: string;
  nodeType: ApiMethodItemType;
  type: string[];
  description?: string;
}

export interface ApiGroup extends ApiExtractor {
  title: string;
  nodes: ApiNode[];
}

export const TsdocSyntaxKind = {
  Variable: 32,
  Function: 64,
  Class: 128,
  Interface: 256,
  Property: 1024,
  Method: 2048,
  Accessor: 262144,
  SetSignature: 1048576,
  TypeAlias: 4194304,
};
