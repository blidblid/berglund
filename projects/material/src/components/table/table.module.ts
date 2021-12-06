import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BergOutletModule } from '@berglund/mixins';
import { BergConnectModule } from '@berglund/rx';
import { BergTableComponent } from './table.component';

@NgModule({
  declarations: [BergTableComponent],
  imports: [
    BergConnectModule,
    BergOutletModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  exports: [BergTableComponent],
})
export class BergTableModule {}
