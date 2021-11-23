import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BergOutletModule, ErrorPipeModule } from '@berglund/mixins';
import { BergInputComponent } from './input.component';

@NgModule({
  declarations: [BergInputComponent],
  exports: [BergInputComponent],
  imports: [
    BergOutletModule,
    CommonModule,
    ErrorPipeModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class BergInputModule {}
