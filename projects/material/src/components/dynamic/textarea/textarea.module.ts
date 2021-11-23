import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorPipeModule } from '@berglund/mixins';
import { BergTextareaComponent } from './textarea.component';

@NgModule({
  declarations: [BergTextareaComponent],
  exports: [BergTextareaComponent],
  imports: [
    CommonModule,
    ErrorPipeModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    ReactiveFormsModule,
  ],
})
export class BergTextareaModule {}
