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
import { BehaviorSubject, fromEvent, merge, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { BergPopperInputs, BERG_POPPER_INPUTS } from './popper-model';
import { BERG_POPPER_CONTENT, DEFAULT_INPUTS } from './popper-model-private';
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
    this.inputs?.followMouse ?? DEFAULT_INPUTS.followMouse;

  /** Whether the popover is disabled. */
  @Input('bergPopperDisabled')
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean = this.inputs?.disabled ?? DEFAULT_INPUTS.disabled;

  /** Offset of popover from cursor. */
  @Input('bergPopperCursorOffset')
  cursorOffset: number =
    this.inputs?.cursorOffset ?? DEFAULT_INPUTS.cursorOffset;

  /** Mouse event that should trigger the popper. */
  @Input('bergPopperTrigger') trigger: 'enter' | 'stationary' =
    this.inputs?.trigger ?? DEFAULT_INPUTS.trigger;

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

    return ref instanceof Type
      ? new ComponentPortal(ref, this.viewContainerRef)
      : typeof ref === 'string'
      ? new ComponentPortal(
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
        )
      : new TemplatePortal(ref, this.viewContainerRef);
  }

  private createOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.createPositionStrategy(),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  private createPositionStrategy(
    xOffset: number = 0,
    yOffset: number = 0
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
    const mouseleave$ = fromEvent(this.hostElem, 'mouseleave');
    const mouseOpen$ =
      this.trigger === 'stationary'
        ? mouseStationary(this.hostElem)
        : fromEvent(this.hostElem, 'mouseenter');

    const open$ = merge(focus$, mouseOpen$).pipe(
      map(() => true),
      filter(() => !this._disabled)
    );

    const event$ = merge(
      open$,
      merge(blur$, mouseleave$).pipe(map(() => false))
    ).pipe(distinctUntilChanged());

    event$.pipe(takeUntil(this.destroySub)).subscribe((open) => {
      if (open) {
        this.open();
      } else {
        this.close();
      }
    });
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
