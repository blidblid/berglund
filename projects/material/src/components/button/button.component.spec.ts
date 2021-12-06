import {
  getDisabledSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergButtonComponent } from './button.component';
import { BergButtonModule } from './button.module';

describe('ButtonComponent', () => {
  let tester: MixinComponentTester<BergButtonComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergButtonComponent, [
        BergButtonModule,
      ]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
