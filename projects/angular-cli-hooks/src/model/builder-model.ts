import { BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';

export type BuilderCommandName =
  | 'build'
  | 'serve'
  | 'i18n'
  | 'test'
  | 'build-lib'
  | 'e2e'
  | 'server';

export type GenericBuilderOutput =
  | Observable<BuilderOutput>
  | Promise<BuilderOutput>
  | BuilderOutput;
