import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BergCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [BergCheckboxComponent],
  exports: [BergCheckboxComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class BergCheckboxModule {}
