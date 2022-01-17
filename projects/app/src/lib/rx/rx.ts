import { Injectable } from '@angular/core';
import { CharacterRx } from './character-dashboard';
import { CharacterTimeReportRx } from './character-time-report';

@Injectable({ providedIn: 'root' })
export class Rx {
  constructor(
    public character: CharacterRx,
    public timeReport: CharacterTimeReportRx
  ) {}
}
