import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialServiceOverrideModule } from '@showcase/core';
import { SharedModule } from '../generated/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';

const VIEW_MODULES = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MainModule,
    RouterModule,
    MaterialServiceOverrideModule,
    SharedModule,
    ...VIEW_MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
