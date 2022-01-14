import { Connectable } from '@berglund/rx';
import { IncludeArray } from '../../util';

export interface EventEmitter<T> {
  connectToEvent: Connectable<T>;
  eventName: IncludeArray<string>;
  context: T | null;
}
