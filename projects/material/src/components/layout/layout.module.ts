import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BergLayoutLeftSidenavComponent } from './layout-left-sidenav.component';
import { BergLayoutRightSidenavComponent } from './layout-right-sidenav.component';
import { BergLayoutToolbarComponent } from './layout-toolbar.component';
import { BergLayoutComponent } from './layout.component';

const API = [
  BergLayoutLeftSidenavComponent,
  BergLayoutRightSidenavComponent,
  BergLayoutToolbarComponent,
  BergLayoutComponent,
];

@NgModule({
  declarations: API,
  exports: API,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule],
})
export class BergLayoutModule {}
