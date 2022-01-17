import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Components } from '@app/components';
import { Rx } from 'projects/app/src/lib/rx';

@Component({
  selector: 'app-character-dashboard',
  templateUrl: './character-dashboard.component.html',
  styleUrls: ['./character-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-character-dashboard',
  },
})
export class CharacterDashboardComponent {
  constructor(public rx: Rx, public components: Components) {}
}
