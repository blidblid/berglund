import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
} from '@angular/material/datepicker';
import { BergCalendarBase, BergCalendarDate } from '@berglund/mixins';
import { BehaviorSubject, merge, Observable, ReplaySubject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
  host: {
    class: 'berg-calendar',
  },
})
export class BergCalendarComponent extends BergCalendarBase {
  _errors: ValidationErrors | null = null;

  private selectedSub = new BehaviorSubject<Date | null>(null);

  _selectedDate$ = this.selectedSub.pipe(
    withLatestFrom(this._isRange$),
    map(([date, isRange]) => {
      if (!isRange) {
        return date;
      }

      if (
        date &&
        this.selectedDate instanceof DateRange &&
        this.selectedDate.start &&
        date > this.selectedDate.start &&
        !this.selectedDate.start.end
      ) {
        this.selectedDate = new DateRange(this.selectedDate.start, date);
      } else {
        this.selectedDate = new DateRange(date, null);
      }

      return this.selectedDate;
    })
  );

  private writeSub = new ReplaySubject<BergCalendarDate>(1);

  _selected$ = merge(this._selectedDate$, this.writeSub);

  private selectedDate: BergCalendarDate = null;

  constructor(protected override injector: Injector) {
    super(injector);
  }

  override getChanges(): Observable<BergCalendarDate> {
    return this._selected$;
  }

  override update(date: BergCalendarDate): void {
    this.writeSub.next(date);
  }

  override setErrors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  _onSelectedChange(date: Date): void {
    this.selectedSub.next(date);
  }
}
