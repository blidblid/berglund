import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BergConnectFormControlValueDirective } from './connect-form-control-value.directive';

const API = [BergConnectFormControlValueDirective];

@NgModule({
  declarations: API,
  exports: API,
  imports: [CommonModule],
})
export class BergConnectModule {}
