import { NgModule } from '@angular/core';
import {
  BergCalendarModule,
  BergInputModule,
  BergLayoutModule,
  BergListModule,
  BergSelectModule,
  BergTableModule,
} from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';

const BERG = [
  BergCalendarModule,
  BergInputModule,
  BergLayoutModule,
  BergListModule,
  BergOutletModule,
  BergSelectModule,
  BergTableModule,
];

@NgModule({
  imports: BERG,
  exports: BERG,
})
export class BergSharedModule {}
