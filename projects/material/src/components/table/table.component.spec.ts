import { MixinComponentInputs } from '@berglund/mixins';
import {
  getDisabledSpec,
  getHintSpec,
  getLabelSpec,
  MixinComponentTester,
  testComponentInputs,
} from '@berglund/mixins/testing';
import { BergTableComponent } from './table.component';
import { BergTableModule } from './table.module';

describe('BergTableComponent', () => {
  let tester: MixinComponentTester<BergTableComponent>;

  describe('mixins', () => {
    beforeEach(() => {
      tester = new MixinComponentTester(BergTableComponent, [BergTableModule]);
    });

    it('should mixin label', () => {
      testComponentInputs(tester, [getLabelSpec(), getHintSpec()]);
    });

    it('should mixin interactive', () => {
      testComponentInputs(tester, [getDisabledSpec()]);
    });

    it('should mixin collection', () => {
      const data = [
        { id: 'f', name: 'Fire' },
        { id: 'w', name: 'Water' },
        { id: 'e', name: 'Earth' },
      ];

      const commonInputs: MixinComponentInputs<BergTableComponent> = {
        data,
        columns: [
          {
            key: 'name',
          },
        ],
      };

      testComponentInputs(tester, [
        {
          givenInputs: commonInputs,
          thenDomChange: {
            thenAllSelector: [
              (elements) => expect(elements.length).toBe(data.length),
              '.mat-row',
            ],
          },
        },
        {
          givenInputs: {
            ...commonInputs,
            pluckCellLabel: (element, column) => element[column],
          },
          thenDomChange: {
            thenTextContent: [
              (textContent) => expect(textContent).toBe(data[0].name),
              '.mat-row',
            ],
          },
        },
      ]);
    });
  });
});
