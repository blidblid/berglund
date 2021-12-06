import { BergRadioModule } from '@berglund/material';
import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergRadioComponent } from './radio.component';

describe('RadioComponent', () => {
  let tester: MixinComponentTester<BergRadioComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergRadioComponent, [BergRadioModule]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [getLabelSpec(), getHintSpec()]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
