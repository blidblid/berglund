import { Injectable } from '@angular/core';
import { BergCalendarComponent } from '@berglund/material';
import { component } from '@berglund/mixins';

@Injectable({ providedIn: 'root' })
export class TimeReportComponents {
  calendar = component({
    component: BergCalendarComponent,
    inputs: { isRange: true },
  });
}
