import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BergConnectModule } from '@berglund/rx';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BergSharedModule } from './berg-shared.module';
import { CharacterDashboardComponent } from './character-dashboard/character-dashboard.component';
import { CharacterTimeReportComponent } from './character-time-report/character-time-report.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterDashboardComponent,
    CharacterTimeReportComponent,
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BergConnectModule,
    BergSharedModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
