import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BergCalendarComponent } from './calendar.component';

@NgModule({
  declarations: [BergCalendarComponent],
  exports: [BergCalendarComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
})
export class BergCalendarModule {}
