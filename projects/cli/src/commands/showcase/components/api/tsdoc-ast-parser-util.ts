import {
  ApiFunctionItem,
  ApiItem,
  ApiMethodItem,
  ApiPropertyItem,
} from './tsdoc-ast-parser-model';

export function isMethodItem(item: ApiItem): item is ApiMethodItem {
  return item.nodeType === 'Method';
}
export function isFunctionItem(item: ApiItem): item is ApiFunctionItem {
  return item.nodeType === 'Function';
}

export function isPropertyItem(item: ApiItem): item is ApiPropertyItem {
  return (
    item.nodeType === '@Input()' ||
    item.nodeType === '@Output()' ||
    item.nodeType === 'Property'
  );
}
