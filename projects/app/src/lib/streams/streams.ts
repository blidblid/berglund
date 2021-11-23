import { Injectable } from '@angular/core';
import { CharacterStreams } from './character-dashboard';
import { CharacterTimeReportStreams } from './character-time-report';

@Injectable({ providedIn: 'root' })
export class Streams {
  constructor(
    public character: CharacterStreams,
    public timeReport: CharacterTimeReportStreams
  ) {}
}
