import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergSlideToggleComponent } from './slide-toggle.component';
import { BergSlideToggleModule } from './slide-toggle.module';

describe('SlideToggleComponent', () => {
  let tester: MixinComponentTester<BergSlideToggleComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergSlideToggleComponent, [
        BergSlideToggleModule,
      ]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [
        getLabelSpec('mat-slide-toggle'),
        getHintSpec('mat-hint'),
      ]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
