import { Entity } from '@berglund/firebase';

export interface Project extends Required<Entity> {
  name: string;
}
