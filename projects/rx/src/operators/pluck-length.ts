import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

/** Plucks the length of a value. */
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

        if (typeof value === 'object' && value !== null) {
          return Object.values(value).length;
        }

        return 0;
      })
    );
}
