import {
  createSourceFile,
  Node,
  ScriptKind,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
  SyntaxList,
} from 'typescript';

export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V extends Node
>(node: Node, t1: (node: Node) => node is V): V | null;
export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V1 extends Node,
  V2 extends Node
>(
  node: Node,
  t1: (node: Node) => node is V1,
  t2: (node: Node) => node is V2
): V2 | null;
export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V1 extends Node,
  V2 extends Node,
  V3 extends Node
>(
  node: Node,
  t1: (node: Node) => node is V1,
  t2: (node: Node) => node is V2,
  t3: (node: Node) => node is V3
): V3 | null;
export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V1 extends Node,
  V2 extends Node,
  V3 extends Node,
  V4 extends Node
>(
  node: Node,
  t1: (node: Node) => node is V1,
  t2: (node: Node) => node is V2,
  t3: (node: Node) => node is V3,
  t4: (node: Node) => node is V4
): V4 | null;
export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V1 extends Node,
  V2 extends Node,
  V3 extends Node,
  V4 extends Node,
  V5 extends Node
>(
  node: Node,
  t1: (node: Node) => node is V1,
  t2: (node: Node) => node is V2,
  t3: (node: Node) => node is V3,
  t4: (node: Node) => node is V4,
  t5: (node: Node) => node is V5
): V5 | null;
export function chainTypeGuards<
  T extends (node: Node) => node is any,
  V1 extends Node,
  V2 extends Node,
  V3 extends Node,
  V4 extends Node,
  V5 extends Node,
  V6 extends Node
>(
  node: Node,
  t1: (node: Node) => node is V1,
  t2: (node: Node) => node is V2,
  t3: (node: Node) => node is V3,
  t4: (node: Node) => node is V4,
  t5: (node: Node) => node is V5,
  t6: (node: Node) => node is V6
): V6 | null;
export function chainTypeGuards<T extends (node: Node) => node is any>(
  node: any,
  ...typeGuards: T[]
): any {
  for (const typeGuard of typeGuards) {
    const next = node.getChildren().find(typeGuard);

    if (next) {
      node = next;
    } else {
      return null;
    }
  }

  return node;
}

export function createDummySourceFile(sourceText = ''): SourceFile {
  return createSourceFile(
    'dummy.ts',
    sourceText,
    ScriptTarget.ESNext,
    false,
    ScriptKind.TS
  );
}

export function isSyntaxList(node: Node): node is SyntaxList {
  return node.kind === SyntaxKind.SyntaxList;
}
