import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BergDatepickerComponent } from './datepicker.component';

@NgModule({
  declarations: [BergDatepickerComponent],
  exports: [BergDatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class BergDatepickerModule {}
