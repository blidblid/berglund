import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  getPlaceholderSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergInputComponent } from './input.component';
import { BergInputModule } from './input.module';

describe('InputComponent', () => {
  let tester: MixinComponentTester<BergInputComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergInputComponent, [BergInputModule]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [
        getLabelSpec(),
        getHintSpec(),
        getPlaceholderSpec('input', 'data-placeholder'),
      ]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
