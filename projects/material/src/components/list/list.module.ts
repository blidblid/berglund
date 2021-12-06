import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { BergListComponent } from './list.component';

@NgModule({
  declarations: [BergListComponent],
  exports: [BergListComponent],
  imports: [CommonModule, MatListModule, ReactiveFormsModule],
})
export class BergListModule {}
