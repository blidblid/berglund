import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BergOutletComponent } from './outlet.component';

@NgModule({
  declarations: [BergOutletComponent],
  exports: [BergOutletComponent],
  imports: [CommonModule],
})
export class BergOutletModule {}
