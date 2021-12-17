import { OperatorFunction } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

/** Reduces an array from a stream of `ReducerAction`. */
export function actionArrayReducer<T>(): OperatorFunction<
  ReducerAction<T>,
  T[]
> {
  return (source$) =>
    source$.pipe(
      scan((acc, curr) => {
        switch (curr.action) {
          case 'add':
            return [...acc, curr.value];
          case 'remove':
            return acc.filter((a) => a !== curr.value);
          case 'update':
            return acc.map((a) => (a === curr.oldValue ? curr.newValue : a));
          case 'clear':
            return [];
          default:
            return acc;
        }
      }, [] as T[]),
      shareReplay({ bufferSize: 1, refCount: true })
    );
}

export interface AddAction<T> {
  action: 'add';
  value: T;
}

export interface ClearAction {
  action: 'clear';
}

export interface RemoveAction<T> {
  action: 'remove';
  value: T;
}

export interface UpdateAction<T> {
  action: 'update';
  newValue: T;
  oldValue: T;
}

export type ReducerAction<T> =
  | AddAction<T>
  | ClearAction
  | RemoveAction<T>
  | UpdateAction<T>;
