import { Directive, Input, OnDestroy } from '@angular/core';
import { Observable, race, ReplaySubject, Subject } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { CrudApi } from '../core/realtime-database/crud-api';
import { Entity } from '../model/entity-model';

@Directive()
export class DisplaysEntity<T extends Entity> implements OnDestroy {
  @Input()
  set id(value: string | null) {
    if (value) {
      this.idSub.next(value);
    }
  }
  private idSub = new ReplaySubject<string>();

  @Input()
  set entity(value: T | null) {
    if (value !== null) {
      this.entitySub.next(value);
    }
  }
  private entitySub = new ReplaySubject<T>();

  entity$: Observable<T> = race(
    this.entitySub.asObservable(),
    this.idSub.pipe(switchMap((id) => this.apiService.get(id)))
  ).pipe(filter((entity): entity is T => entity !== null));

  id$: Observable<string> = race(
    this.idSub.asObservable(),
    this.entitySub.pipe(
      map((entity) => entity.id),
      filter((id): id is string => id !== undefined)
    )
  );

  protected destroySub = new Subject<void>();

  constructor(protected apiService: CrudApi<T>) {}

  pluck<K extends keyof T>(key: K): Observable<T[K]> {
    return this.entity$.pipe(
      pluck(key),
      filter((property) => property !== undefined && property !== null)
    );
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
