import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergSelectComponent } from './select.component';
import { BergSelectModule } from './select.module';

describe('SelectComponent', () => {
  let tester: MixinComponentTester<BergSelectComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergSelectComponent, [
        BergSelectModule,
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
