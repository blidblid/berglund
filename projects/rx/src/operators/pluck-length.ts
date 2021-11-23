import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function pluckLength(): OperatorFunction<any, number> {
  return (observable) =>
    observable.pipe(
      map((value) => {
        if (Array.isArray(value) || typeof value === 'string') {
          return value.length;
        }

        if (value instanceof Map || value instanceof Set) {
          return value.size;
        }

        if (value === null) {
          return 0;
        }

        if (typeof value === 'object') {
          return Object.values(value).length;
        }

        return 0;
      })
    );
}
