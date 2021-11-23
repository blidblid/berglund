import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BergSlideToggleComponent } from './slide-toggle.component';

@NgModule({
  declarations: [BergSlideToggleComponent],
  exports: [BergSlideToggleComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
})
export class BergSlideToggleModule {}
