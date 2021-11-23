import { IncludeArray } from '../../util';

export interface Button<V = any> {
  type: ButtonType;
  style: ButtonStyle;
  isError: boolean;
  eventName: IncludeArray<string>;
  context: V | null;
}

export type ButtonType = 'proceed' | 'cancel';
export type ButtonStyle = 'icon' | 'label';
