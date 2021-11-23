import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigatorComponent } from './navigator.component';

@NgModule({
  declarations: [NavigatorComponent],
  exports: [NavigatorComponent],
  imports: [CommonModule],
})
export class NavigatorModule {}
