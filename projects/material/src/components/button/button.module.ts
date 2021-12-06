import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorPipeModule } from '@berglund/mixins';
import { BergButtonComponent } from './button.component';

@NgModule({
  declarations: [BergButtonComponent],
  exports: [BergButtonComponent],
  imports: [
    CommonModule,
    ErrorPipeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
})
export class BergButtonModule {}
