import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BergButtonBase } from '@berglund/mixins';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-button',
  },
})
export class BergButtonComponent extends BergButtonBase {
  _color$: Observable<ThemePalette> = this._isError$.pipe(
    map((isError) => (isError ? 'warn' : 'primary'))
  );

  constructor(protected override injector: Injector) {
    super(injector);
  }
}
