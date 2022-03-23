export interface DomData {
  titleIds: string[];
}

export type AngularDecorator = 'component' | 'module';

export interface TsAstData {
  decorator?: AngularDecorator;
  className?: string;
}

export type ShowcaseComponentType = 'main' | 'container' | 'readme' | 'api';

export interface File extends TsAstData {
  id: string;
  content: string;
  fileName: string;
  fileNameWithoutExtension: string;
  relativePath: string;
  localPath: string;
  extension: string;
}

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
  referenceNode: ChildNode;
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

export function isContainerComponent(
  component: any
): component is ContainerComponent {
  return !!component.children;
}
