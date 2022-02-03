import { userValue } from '@berglund/rx';
import { of } from 'rxjs';

describe('userValue', () => {
  it('should start with a sync source', () => {
    const source = 'noa';
    const userValue$ = userValue(source);

    userValue$.subscribe((value) => {
      expect(value).toBe(source);
    });
  });

  it('should subscribe to an observable source', () => {
    const source = 'noa';
    const source$ = of(source);
    const userValue$ = userValue(source$);

    userValue$.subscribe((value) => {
      expect(value).toBe(source);
    });
  });
});
