import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BergErrorPipe } from './error.pipe';

@NgModule({
  declarations: [BergErrorPipe],
  exports: [BergErrorPipe],
  imports: [CommonModule],
})
export class BergErrorPipeModule {}
