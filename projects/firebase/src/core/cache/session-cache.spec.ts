import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionCache } from './session-cache';

describe('session cache', () => {
  let sessionCache: SessionCache;

  beforeEach(() => {
    sessionCache = new SessionCache();
  });

  it('should cache', () => {
    const a$ = of('').pipe(map(() => ({})));

    sessionCache
      .get('a', () => a$)
      .subscribe((value) => {
        sessionCache
          .get('a', () => a$)
          // eslint-disable-next-line rxjs/no-nested-subscribe
          .subscribe((cachedValue) => {
            expect(value).toBe(cachedValue);
          });

        sessionCache
          .get('b', () => a$)
          // eslint-disable-next-line rxjs/no-nested-subscribe
          .subscribe((cachedValue) => {
            expect(value).not.toBe(cachedValue);
          });
      });
  });
});
