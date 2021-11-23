import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDashboardComponent } from './character-dashboard/character-dashboard.component';
import { CharacterTimeReportComponent } from './character-time-report/character-time-report.component';

const routes: Routes = [
  { path: '', component: CharacterDashboardComponent },
  { path: 'time', component: CharacterTimeReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
