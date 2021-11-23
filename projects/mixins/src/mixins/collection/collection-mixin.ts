import { EventEmitter } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Connectable, connectConnectable } from '@berglund/rx';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IncludeType } from '../../util';
import { Constructor, Mixin, MixinApi } from '../core';
import {
  Collection,
  CollectionGroup,
  CollectionGroupByFn,
  CollectionPluckDisabled,
  CollectionPluckDisabledFn,
  CollectionPluckLabel,
  CollectionPluckLabelFn,
  CollectionPluckRearrangeable,
  CollectionPluckRearrangeableFn,
  CollectionSelectionType,
  CollectionSortComparators,
} from './collection-model';

interface CollectionMixin<S extends CollectionSelectionType, T>
  extends MixinApi<Collection<S, T>> {
  _sortCollection(sort: CollectionSortEvent<T>): void;

  dataChanged: EventEmitter<T[]>;

  _radio$: Observable<boolean>;
  _single$: Observable<boolean>;
  _multiple$: Observable<boolean>;

  _groupedData$: Observable<CollectionGroup<T>[]>;
  _ungroupedData$: Observable<T[]>;
  _empty$: Observable<boolean>;
  _pluckLabelFn: CollectionPluckLabelFn<T>;
  _pluckLabelFn$: Observable<CollectionPluckLabelFn<T>>;
  _pluckDisabledFn: CollectionPluckDisabledFn<T>;
  _pluckDisabledFn$: Observable<CollectionPluckDisabledFn<T>>;
  _pluckRearrangeableFn: CollectionPluckRearrangeableFn<T>;
  _pluckRearrangeableFn$: Observable<CollectionPluckRearrangeableFn<T>>;
}

export interface CollectionSortEvent<T> {
  /** Key to sort. */
  key: keyof T;

  /** Whether to sort descending. */
  descending?: boolean;
}

export type CollectionConstructor<
  S extends CollectionSelectionType,
  T
> = Constructor<CollectionMixin<S, T>>;

/**
 * A collection component has values.
 */
export function mixinCollection<
  T extends Constructor<Mixin<Collection<S, V>>>,
  S extends CollectionSelectionType = CollectionSelectionType,
  V = any
>(base: T): CollectionConstructor<S, V> & T {
  return class extends base {
    selection: S | Observable<S>;
    _selection: S;
    _selection$ = this.defineAccessors('selection', 'radio' as S);

    _multiple$ = this._selection$.pipe(
      map((selection) => selection === 'multiple')
    );

    _single$ = this._selection$.pipe(
      map((selection) => selection === 'single')
    );

    _radio$ = this._selection$.pipe(map((selection) => selection === 'radio'));

    connectCollection: Connectable<V[]> | Observable<Connectable<V[]>>;
    _connectCollection: Connectable<V[]>;
    _connectCollection$ = this.defineAccessors('connectCollection', null);

    private updateCollectionSub = new ReplaySubject<V[]>(1);
    data: V[] | Observable<V[]>;
    _data: V[];
    _data$ = this.defineAccessors('data', []);
    _rawData$ = merge(this._data$, this.updateCollectionSub).pipe(
      map((data) => data ?? [])
    );

    _empty$ = this._rawData$.pipe(map((data) => data.length === 0));

    private collectionErrorsSub = new ReplaySubject<ValidationErrors | null>(1);
    _collectionErrors$ = this.collectionErrorsSub.asObservable();

    groupBy: CollectionGroupByFn<V> | Observable<CollectionGroupByFn<V>>;
    _groupBy: CollectionGroupByFn<V>;
    _groupBy$ = this.defineAccessors('groupBy', null);

    comparators:
      | CollectionSortComparators<V>
      | Observable<CollectionSortComparators<V>>;
    _comparators: CollectionSortComparators<V>;
    _comparators$ = this.defineAccessors('comparators', null);

    pluckLabel: CollectionPluckLabel<V> | Observable<CollectionPluckLabel<V>>;
    _pluckLabel: CollectionPluckLabel<V>;
    _pluckLabel$ = this.defineAccessors('pluckLabel', (value, property) => {
      return `${property ? value[property] : value}`;
    });
    _pluckLabelFn$ = this._pluckLabel$.pipe(map((value) => this._pluck(value)));
    get _pluckLabelFn(): CollectionPluckLabelFn<V> {
      return this._pluck(this._pluckLabel);
    }

    pluckDisabled:
      | CollectionPluckDisabled<V>
      | Observable<CollectionPluckDisabled<V>>;
    _pluckDisabled: CollectionPluckDisabled<V>;
    _pluckDisabled$ = this.defineAccessors('pluckDisabled', () => false);
    _pluckDisabledFn$ = this._pluckDisabled$.pipe(
      map((value) => this._pluck(value))
    );
    get _pluckDisabledFn(): CollectionPluckDisabledFn<V> {
      return this._pluck(this._pluckDisabled);
    }

    pluckRearrangeable:
      | CollectionPluckRearrangeable<V>
      | Observable<CollectionPluckRearrangeable<V>>;
    _pluckRearrangeable: CollectionPluckRearrangeable<V>;
    _pluckRearrangeable$ = this.defineAccessors(
      'pluckRearrangeable',
      () => false
    );
    _pluckRearrangeableFn$ = this._pluckRearrangeable$.pipe(
      map((value) => this._pluck(value))
    );
    get _pluckRearrangeableFn(): CollectionPluckRearrangeableFn<V> {
      return this._pluck(this._pluckRearrangeable);
    }

    private sortEventSub = new BehaviorSubject<CollectionSortEvent<V> | null>(
      null
    );

    sort = combineLatest([this.sortEventSub, this._comparators$]).pipe(
      map(([sorterEvent, comparators]) => {
        return {
          comparator:
            sorterEvent && comparators ? comparators[sorterEvent.key] : null,
          ...sorterEvent,
        };
      })
    );

    sortedData$ = combineLatest([this._rawData$, this.sort]).pipe(
      map(([data, sort]) => {
        const key = sort.key;

        if (!key) {
          return data;
        }

        const sortedData = data
          .slice()
          .sort(
            sort.comparator
              ? sort.comparator
              : (a, b) => (a[key] > b[key] ? 1 : -1)
          );

        return sort.descending ? sortedData : sortedData.reverse();
      })
    );

    _ungroupedData$ = combineLatest([this.sortedData$, this._groupBy$]).pipe(
      map(([data, groupBy]) => (groupBy ? [] : data))
    );

    _groupedData$ = combineLatest([this.sortedData$, this._groupBy$]).pipe(
      map(([data, groupBy]) => (groupBy ? groupBy(data) : []))
    );

    dataChanged = new EventEmitter<V[]>();

    constructor(...args: any[]) {
      super(...args);

      this._connectCollection$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((connectable) => {
          if (connectable) {
            connectConnectable<V[]>(
              connectable,
              {
                getChanges: () => this.getCollectionChanges(),
                setErrors: (errors: ValidationErrors | null) => {
                  return this.setCollectionErrors(errors);
                },
                update: (value: V[]) => this.updateCollection(value),
              },
              this.destroyed$
            );
          }
        });
    }

    _sortCollection(sortEvent: CollectionSortEvent<V>) {
      this.sortEventSub.next(sortEvent);
    }

    getCollectionChanges(): Observable<V[]> {
      return this.dataChanged.asObservable();
    }

    updateCollection(value: V[]): void {
      this.updateCollectionSub.next(value);
    }

    setCollectionErrors(errors: ValidationErrors | null): void {
      this.collectionErrorsSub.next(errors);
    }

    private _pluck<R, V, K extends keyof IncludeType<V, R>>(
      keyOrFn: ((value: V) => R) | K
    ): (value: V, property?: keyof V) => R {
      if (typeof keyOrFn === 'function') {
        return keyOrFn;
      }

      return (value: any, property?: any) => {
        return property ? value[keyOrFn][property] : value[keyOrFn];
      };
    }
  };
}
