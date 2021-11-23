import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentOutletContext } from '../../mixins';
import { ensureArray } from '../../util';
import { BergComponentBuilder, MixinComponent } from '../component-builder';

/**
 * Creates a dynamic component and sets its inputs.
 */
@Component({
  selector: 'berg-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-outlet',
    '[class.berg-outlet-empty]': 'empty',
  },
})
export class BergOutletComponent {
  @Input()
  set component(value: MixinComponent | MixinComponent[] | null) {
    this.viewContainerRef.clear();
    this.empty = value === null || (Array.isArray(value) && value.length === 0);

    this.componentBuilder.create(
      ensureArray(value ?? []),
      this.viewContainerRef,
      this
    );
  }

  @Input() context: ComponentOutletContext | null;

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  private viewContainerRef: ViewContainerRef;

  empty = false;

  constructor(private componentBuilder: BergComponentBuilder) {}
}
