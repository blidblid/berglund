import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BergIntersectionNodeDirective } from './intersection-node.directive';
import { BergIntersectionDirective } from './intersection.directive';

const API = [BergIntersectionNodeDirective, BergIntersectionDirective];

@NgModule({
  declarations: API,
  exports: API,
  imports: [CommonModule],
})
export class BergIntersectionModule {}
