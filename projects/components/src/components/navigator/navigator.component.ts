import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { NavigatorTarget } from './navigator-model';
import { NavigatorService } from './navigator.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-navigator app-color flex a-center j-center',
  },
})
export class NavigatorComponent implements OnDestroy {
  activeQuery$: Observable<string>;
  resolvedMatch$: Observable<string>;

  private resolvedQuery$: Observable<NavigatorTarget | null>;

  private destroySub = new Subject<void>();

  constructor(
    private navigatorService: NavigatorService,
    private router: Router
  ) {
    this.buildObservables();
  }

  private buildObservables(): void {
    this.activeQuery$ = this.navigatorService.getActiveQuery();
    this.resolvedQuery$ = this.navigatorService.getResolvedQuery();

    this.resolvedMatch$ = this.resolvedQuery$.pipe(
      map((query) => (query ? query.match : ''))
    );

    this.navigatorService
      .getRouting()
      .pipe(
        switchMap((resolvedQuery) => {
          return this.router.navigateByUrl(resolvedQuery.url);
        }),
        takeUntil(this.destroySub)
      )
      .subscribe(() => {
        this.navigatorService.reset();
      });
  }

  ngOnDestroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
  }
}
