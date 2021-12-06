import { MatNativeDateModule } from '@angular/material/core';
import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergDatepickerComponent } from './datepicker.component';
import { BergDatepickerModule } from './datepicker.module';

describe('DatepickerComponent', () => {
  let tester: MixinComponentTester<BergDatepickerComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergDatepickerComponent, [
        BergDatepickerModule,
        MatNativeDateModule,
      ]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [getLabelSpec(), getHintSpec()]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
