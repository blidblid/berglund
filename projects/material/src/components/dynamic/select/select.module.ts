import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BergOutletModule, ErrorPipeModule } from '@berglund/mixins';
import { BergSelectComponent } from './select.component';

@NgModule({
  declarations: [BergSelectComponent],
  exports: [BergSelectComponent],
  imports: [
    BergOutletModule,
    CommonModule,
    ErrorPipeModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class BergSelectModule {}
