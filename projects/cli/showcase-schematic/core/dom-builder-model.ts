import { File } from '../../../core';

export interface DomData {
  titleIds: string[];
}

export type AngularDecorator = 'component' | 'module';

export type ShowcaseComponentType = 'container' | 'readme' | 'api' | 'editor';

export interface Component extends DomData {
  id: string;
  name: string;
  componentFile: File;
  ngModuleFile: File;
  templateFile: File;
  files: File[];
  examples: ExampleComponent[];
  type: ShowcaseComponentType;
  category?: string;
}

export interface ContainerComponent extends Component {
  children: Component[];
}

export interface ExampleComponent {
  files: File[];
  referenceNode?: ChildNode;
  containerElement: HTMLElement;
}

export interface Cell<T> {
  label: string;
  key: keyof T;
  isCode?: boolean;
}

export interface RenderedCell {
  content: any;
  isCode?: boolean;
}

export function isContainerComponent(component: any): component is ContainerComponent {
  return !!component.children;
}
