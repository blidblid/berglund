import { ActivatedRoute } from '@angular/router';
import { CrudApi, Entity } from '@berglund/firebase';
import { Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

export class RoutesEntity<T extends Entity> {
  id$: Observable<string> = this.activatedRoute.paramMap.pipe(pluck('id'));

  entity$: Observable<T> = this.id$.pipe(
    switchMap((id) => this.crudApi.get(id))
  );

  constructor(
    protected crudApi: CrudApi<T>,
    protected activatedRoute: ActivatedRoute
  ) {}
}
