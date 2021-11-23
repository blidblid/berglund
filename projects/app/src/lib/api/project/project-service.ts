import { Injectable, Injector } from '@angular/core';
import { CrudApi } from '@berglund/firebase';
import { Project } from './project-model';

@Injectable({
  providedIn: 'root',
})
export class ProjectApi extends CrudApi<Project> {
  constructor(protected override injector: Injector) {
    super(injector, 'projects');
  }
}
