import { Validators } from '@angular/forms';
import { userValue } from '@berglund/rx';
import { EMPTY, of } from 'rxjs';

describe('userValue', () => {
  it('should emit values', () => {
    const value = 'hyzer';
    const userValue$ = userValue();
    userValue$.next(value);

    userValue$.subscribe((value) => {
      expect(value).toBe(value);
    });
  });

  it('should not emit invalid values', () => {
    const userValue$ = userValue<number>(EMPTY, [Validators.min(5)]);
    userValue$.next(0);

    userValue$.subscribe(() => {
      fail();
    });

    userValue$.getErrors().subscribe((errors) => {
      expect(errors).not.toBe(null);
    });
  });

  it('should emit invalid values when emitInvalid is enabled', () => {
    const value = 'flip';
    const userValue$ = userValue<string>(EMPTY, {
      validators: [Validators.min(5)],
      emitInvalid: true,
    });

    userValue$.next(value);

    userValue$.subscribe((value) => {
      expect(value).toBe(value);
    });
  });

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
