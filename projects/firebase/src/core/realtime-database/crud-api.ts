import { Injector } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Entity } from '../../model/entity-model';
import { Flatten } from '../../util/type-util';
import { toUrl } from '../../util/url-util';
import { CacheStrategy, LocalStorageCache } from '../cache';

export class CrudApi<T extends Entity> {
  afd = this.injector.get(AngularFireDatabase);
  cache = this.injector.get(LocalStorageCache);

  constructor(
    protected injector: Injector,
    protected path: string,
    protected cacheStrategy: CacheStrategy = 'persistent'
  ) {}

  get(id: string): Observable<T | null> {
    return this.cache.get(
      this.getPath(id),
      this.afd.object<T>(this.getPath(id)).valueChanges(),
      this.cacheStrategy
    );
  }

  getMany(ids: string[]): Observable<T[]> {
    if (ids.length === 0) {
      return of([]);
    }

    return combineLatest(ids.map((id) => this.get(id))).pipe(
      map((entities) => {
        return entities.filter((entity): entity is T => entity !== null);
      })
    );
  }

  push(value: T): string {
    const id = value.id || this.afd.createPushId();

    this.afd.object<T>(this.getPath(id)).set({
      ...value,
      id: id,
    });

    return id;
  }

  createPushId(): string {
    return this.afd.createPushId();
  }

  getRecord(): Observable<Record<string, T> | null> {
    return this.cache.get(
      this.path,
      this.afd.object<Record<string, T>>(this.path).valueChanges(),
      this.cacheStrategy
    );
  }

  getAll(): Observable<T[] | null> {
    return this.getRecord().pipe(
      map((record) => (record ? Object.values(record) : []))
    );
  }

  getPage(
    limit: number,
    startAtId?: string,
    queryFn?: (query: firebase.database.Query) => firebase.database.Query
  ): Observable<T[]> {
    return this.afd
      .list<T>(this.path, (ref) => {
        const query = queryFn ? queryFn(ref) : ref.orderByKey();
        return startAtId === undefined
          ? query.limitToLast(limit)
          : query.endBefore(startAtId).limitToLast(limit);
      })
      .valueChanges()
      .pipe(map((posts) => posts.reverse()));
  }

  getProperty<K1 extends keyof T, K2 extends keyof T[K1]>(
    id: string,
    property: K1
  ): Observable<T[K1]>;
  getProperty<K1 extends keyof T, K2 extends keyof T[K1]>(
    id: string,
    property: K1,
    propertyId: K2
  ): Observable<T[K1][K2]>;
  getProperty(id: string, ...properties: (keyof T)[]): any {
    return this.cache.get(
      this.getPropertyPath(id, ...properties),
      this.afd.object(this.getPropertyPath(id, ...properties)).valueChanges(),
      this.cacheStrategy
    );
  }

  setProperty<K1 extends keyof T>(
    value: T[K1],
    id: string,
    property: K1
  ): Observable<void>;
  setProperty<K1 extends keyof T, K2 extends keyof T[K1]>(
    value: T[K1][K2],
    id: string,
    property: K1,
    propertyId: K2
  ): Observable<void>;
  setProperty(
    value: any,
    id: string,
    ...properties: (keyof T)[]
  ): Observable<void> {
    return from(
      this.afd.object(this.getPropertyPath(id, ...properties)).set(value)
    );
  }

  removeProperty<K1 extends keyof T>(id: string, property: K1): void;
  removeProperty<K1 extends keyof T, K2 extends keyof T[K1]>(
    id: string,
    property: K1,
    propertyId: K2
  ): void;
  removeProperty(id: string, ...properties: (keyof T)[]): void {
    const path = this.getPropertyPath(id, ...properties);
    this.afd.object(path).remove();
    this.cache.remove(path);
  }

  pushProperty<K extends keyof T>(
    value: Flatten<T[K]>,
    id: string,
    property: K
  ): Observable<string> {
    const promise: firebase.database.ThenableReference = this.afd
      .list<Flatten<T[K]>>(this.getPropertyPath(id, property))
      .push(value);

    return from(promise).pipe(
      filter(
        (
          reference
        ): reference is firebase.database.Reference & { key: string } => {
          return reference.key !== null;
        }
      ),
      map((reference) => {
        return toUrl([this.getPropertyPath(id, property), reference.key]);
      })
    );
  }

  update(id: string, entity: Partial<T>): Observable<void> {
    return from(this.afd.object<T>(this.getPath(id)).update(entity));
  }

  set(id: string, entity: T): Observable<void> {
    return from(this.afd.object<T>(this.getPath(id)).set({ ...entity, id }));
  }

  delete(id: string): Observable<void> {
    return from(this.afd.object<T>(this.getPath(id)).remove());
  }

  protected getPath(id: string): string {
    return toUrl([this.path, id]);
  }

  protected getPropertyPath(id: string, ...properties: (keyof T)[]): string {
    return toUrl([this.getPath(id), ...(properties as string[])]);
  }
}
