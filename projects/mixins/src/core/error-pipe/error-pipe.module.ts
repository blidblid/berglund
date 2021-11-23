import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorPipe } from './error.pipe';

@NgModule({
  declarations: [ErrorPipe],
  exports: [ErrorPipe],
  imports: [CommonModule],
})
export class ErrorPipeModule {}
