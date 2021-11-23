import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@showcase/components';
import { ROUTES } from '../generated/routes';
import { MainComponent } from './main/main.component';

const allRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: ROUTES,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(allRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
