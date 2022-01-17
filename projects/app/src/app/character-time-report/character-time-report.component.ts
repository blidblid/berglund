import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Components } from '@app/components';
import { Rx } from 'projects/app/src/lib/rx';

@Component({
  selector: 'app-character-time-report',
  templateUrl: './character-time-report.component.html',
  styleUrls: ['./character-time-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-character-time-report',
  },
})
export class CharacterTimeReportComponent {
  constructor(public rx: Rx, public components: Components) {}
}
