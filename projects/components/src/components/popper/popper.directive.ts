import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { mouseStationary } from '@berglund/rx';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import {
  BergPopperCloseTrigger,
  BergPopperInputs,
  BergPopperOpenTrigger,
  BERG_POPPER_DEFAULT_INPUTS,
  BERG_POPPER_INPUTS,
} from './popper-model';
import { BERG_POPPER_CONTENT } from './popper-model-private';
import { BergPopperComponent } from './popper.component';

@Directive({
  selector: '[bergPopper]',
})
export class BergPopperDirective
  implements BergPopperInputs, OnInit, OnDestroy
{
  @Input('bergPopper')
  get ref() {
    return this.refSub.value;
  }
  set ref(value: Type<any> | TemplateRef<any> | string | null) {
    this.refSub.next(value || '');
  }
  private refSub = new BehaviorSubject<Type<any> | TemplateRef<any> | string>(
    ''
  );

  /** Whether the popover should follow the mouse pointer. */
  @Input('bergPopperFollowMouse')
  set followMouse(value: boolean) {
    this._followMouse = coerceBooleanProperty(value);
  }
  private _followMouse: boolean =
    this.inputs?.followMouse ?? BERG_POPPER_DEFAULT_INPUTS.followMouse;

  /** Whether the popover is disabled. */
  @Input('bergPopperDisabled')
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean =
    this.inputs?.disabled ?? BERG_POPPER_DEFAULT_INPUTS.disabled;

  /** Offset of popover from cursor. */
  @Input('bergPopperCursorOffset')
  cursorOffset: number =
    this.inputs?.cursorOffset ?? BERG_POPPER_DEFAULT_INPUTS.cursorOffset;

  /** Event that should open the popper. */
  @Input('bergPopperOpenTrigger') openTrigger: BergPopperOpenTrigger =
    this.inputs?.openTrigger ?? BERG_POPPER_DEFAULT_INPUTS.openTrigger;

  /** Event that should close the popper. */
  @Input('bergPopperCloseTrigger') closeTrigger: BergPopperCloseTrigger =
    this.inputs?.closeTrigger ?? BERG_POPPER_DEFAULT_INPUTS.closeTrigger;

  private overlayRef: OverlayRef;
  private destroySub = new Subject<void>();
  private portal: ComponentPortal<any> | TemplatePortal;

  private get hostElem() {
    return this.elementRef.nativeElement;
  }

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    @Inject(BERG_POPPER_INPUTS)
    @Optional()
    private inputs: BergPopperInputs
  ) {}

  open(): void {
    const overlayRef = this.createOverlay();
    const portal = this.createPortal();
    overlayRef.attach(portal);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private createOverlay(): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef;
    }

    const overlayConfig = this.createOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);

    return this.overlayRef;
  }

  private createPortal(): ComponentPortal<any> | TemplatePortal<any> {
    if (this.portal) {
      return this.portal;
    }

    const ref = this.ref || '';

    if (ref instanceof Type) {
      return new ComponentPortal(ref, this.viewContainerRef);
    }

    if (typeof ref === 'string') {
      return new ComponentPortal(
        BergPopperComponent,
        undefined,
        Injector.create({
          providers: [
            {
              provide: BERG_POPPER_CONTENT,
              useValue: this.refSub.asObservable(),
            },
          ],
        })
      );
    }

    return new TemplatePortal(ref, this.viewContainerRef);
  }

  private createOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.createPositionStrategy(),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  private createPositionStrategy(
    xOffset = 0,
    yOffset = 0
  ): FlexibleConnectedPositionStrategy {
    const origin: ConnectedPosition = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
    };

    const extraOffset = this._followMouse ? this.cursorOffset : 0;
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        origin,
        { ...origin, overlayY: 'top', originY: 'bottom' },
      ])
      .withFlexibleDimensions(true)
      .withViewportMargin(8)
      .withPush(this._followMouse)
      .withDefaultOffsetX(xOffset + extraOffset)
      .withDefaultOffsetY(yOffset + extraOffset);

    return strategy;
  }

  private buildOpenerObservables(): void {
    const focus$ = fromEvent(this.hostElem, 'focus');
    const blur$ = fromEvent(this.hostElem, 'blur');
    const openTrigger$ = this.fromOpenTrigger(this.openTrigger);
    const closeTrigger$ = this.fromCloseTrigger(this.closeTrigger);

    const open$ = merge(focus$, openTrigger$).pipe(
      map(() => true),
      filter(() => !this._disabled)
    );

    const event$ = merge(
      open$,
      merge(blur$, closeTrigger$).pipe(map(() => false))
    ).pipe(distinctUntilChanged());

    event$.pipe(takeUntil(this.destroySub)).subscribe((open) => {
      if (open) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  private fromOpenTrigger(trigger: BergPopperOpenTrigger): Observable<Event> {
    if (trigger === 'mousestationary') {
      return mouseStationary(this.hostElem);
    }

    if (trigger === 'mouseenter') {
      return fromEvent(this.hostElem, 'mouseenter');
    }

    if (typeof trigger !== 'function') {
      throw new Error(`Unknown open trigger ${trigger}`);
    }

    return trigger(this.hostElem);
  }

  private fromCloseTrigger(trigger: BergPopperCloseTrigger): Observable<Event> {
    if (trigger === 'mouseleave') {
      return fromEvent(this.hostElem, 'mouseleave');
    }

    if (typeof trigger !== 'function') {
      throw new Error(`Unknown close trigger ${trigger}`);
    }

    return trigger(this.hostElem);
  }

  private buildPositionObservables(): void {
    if (!this._followMouse) {
      return;
    }

    const mouseover$ = fromEvent<MouseEvent>(this.hostElem, 'mousemove').pipe(
      filter(() => this.overlayRef && this.overlayRef.hasAttached()),
      map((event) => ({ x: event.offsetX, y: event.offsetY }))
    );

    mouseover$.pipe(takeUntil(this.destroySub)).subscribe((position) => {
      this.overlayRef.updatePositionStrategy(
        this.createPositionStrategy(position.x, position.y)
      );
    });
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();

    if (this.portal) {
      this.portal.detach();
    }

    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  ngOnInit(): void {
    this.buildOpenerObservables();
    this.buildPositionObservables();
  }
}
