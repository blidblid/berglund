import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BergPopperComponent } from './popper.component';
import { BergPopperDirective } from './popper.directive';

@NgModule({
  declarations: [BergPopperDirective, BergPopperComponent],
  exports: [BergPopperDirective, BergPopperComponent],
  imports: [CommonModule, OverlayModule, PortalModule],
})
export class BergPopperModule {}
