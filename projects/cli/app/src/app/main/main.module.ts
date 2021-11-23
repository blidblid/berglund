import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialSharedModule } from '@showcase/core';
import { MainComponent } from './main.component';

@NgModule({
  imports: [CommonModule, MaterialSharedModule, RouterModule],
  declarations: [MainComponent],
  exports: [MainComponent],
})
export class MainModule {}
