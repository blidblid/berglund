import { Validators } from '@angular/forms';
import { userInput } from '@berglund/rx';
import { EMPTY, of } from 'rxjs';

describe('userInput', () => {
  it('should emit values', () => {
    const value = 'hyzer';
    const userInput$ = userInput();
    userInput$.next(value);

    userInput$.subscribe((value) => {
      expect(value).toBe(value);
    });
  });

  it('should not emit invalid values', () => {
    const userInput$ = userInput<number>(EMPTY, [Validators.min(5)]);
    userInput$.next(0);

    userInput$.subscribe(() => {
      fail();
    });

    userInput$.getErrors().subscribe((errors) => {
      expect(errors).not.toBe(null);
    });
  });

  it('should emit invalid values when emitInvalid is enabled', () => {
    const value = 'flip';
    const userInput$ = userInput<string>(EMPTY, {
      validators: [Validators.min(5)],
      emitInvalid: true,
    });

    userInput$.next(value);

    userInput$.subscribe((value) => {
      expect(value).toBe(value);
    });
  });

  it('should start with a sync source', () => {
    const source = 'noa';
    const userInput$ = userInput(source);

    userInput$.subscribe((value) => {
      expect(value).toBe(source);
    });
  });

  it('should subscribe to an observable source', () => {
    const source = 'noa';
    const source$ = of(source);
    const userInput$ = userInput(source$);

    userInput$.subscribe((value) => {
      expect(value).toBe(source);
    });
  });
});
