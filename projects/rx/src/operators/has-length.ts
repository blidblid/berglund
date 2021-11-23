import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckLength } from './pluck-length';

export function hasLength(): OperatorFunction<any, boolean> {
  return (observable) =>
    observable.pipe(
      pluckLength(),
      map((length) => length > 0)
    );
}
