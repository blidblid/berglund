import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergCheckboxComponent } from './checkbox.component';
import { BergCheckboxModule } from './checkbox.module';

describe('CheckboxComponent', () => {
  let tester: MixinComponentTester<BergCheckboxComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergCheckboxComponent, [
        BergCheckboxModule,
      ]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [
        getLabelSpec('mat-checkbox'),
        getHintSpec(),
      ]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });
  });
});
