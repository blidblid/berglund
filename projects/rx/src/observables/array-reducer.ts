import { EMPTY, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  actionArrayReducer,
  ReducerAction,
  UpdateAction,
} from '../operators/action-array-reducer';

export type UpdateValue<T> = { oldValue: T; newValue: T };

/** Reduces an array from sources that add, clear, remove or update that array.  */
export function arrayReducer<T>(observables: {
  add?: Observable<T>;
  clear?: Observable<any>;
  remove?: Observable<T>;
  update?: Observable<UpdateValue<T>>;
}): Observable<T[]> {
  const {
    add = EMPTY,
    clear = EMPTY,
    remove = EMPTY,
    update = EMPTY,
  } = observables;

  return merge(
    add.pipe(map<T, ReducerAction<T>>((value) => ({ value, action: 'add' }))),
    clear.pipe(map<T, ReducerAction<T>>(() => ({ action: 'clear' }))),
    remove.pipe(
      map<T, ReducerAction<T>>((value) => ({ value, action: 'remove' }))
    ),
    update.pipe(
      map<UpdateValue<T>, UpdateAction<T>>((value) => ({
        ...value,
        action: 'update',
      }))
    )
  ).pipe(actionArrayReducer());
}
