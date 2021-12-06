import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { BergRadioComponent } from './radio.component';

@NgModule({
  declarations: [BergRadioComponent],
  exports: [BergRadioComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
})
export class BergRadioModule {}
