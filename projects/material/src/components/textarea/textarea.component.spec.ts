import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  getPlaceholderSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergTextareaComponent } from './textarea.component';
import { BergTextareaModule } from './textarea.module';

describe('TextareaComponent', () => {
  let tester: MixinComponentTester<BergTextareaComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergTextareaComponent, [
        BergTextareaModule,
      ]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [
        getLabelSpec(),
        getHintSpec(),
        getPlaceholderSpec('textarea', 'data-placeholder'),
      ]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
