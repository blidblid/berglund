import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Components } from '@app/components';
import { Streams } from '@app/streams';

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
  constructor(public streams: Streams, public components: Components) {}
}
