import { Injectable } from '@angular/core';
import { CharacterComponents } from './character-dashboard';
import { TimeReportComponents } from './character-time-report/time-report';

@Injectable({ providedIn: 'root' })
export class Components {
  constructor(
    public character: CharacterComponents,
    public timeReport: TimeReportComponents
  ) {}
}
