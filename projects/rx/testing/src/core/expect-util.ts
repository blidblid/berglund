import { tick } from '@angular/core/testing';
import { Observable } from 'rxjs';

export function expectEmission<T>(
  observable: Observable<T>,
  expectFn: (value: T) => void,
  fakeAsyncTick?: number
) {
  let emitted = false;

  const subscription = observable.subscribe((value) => {
    emitted = true;
    expectFn(value);
  });

  if (fakeAsyncTick !== undefined) {
    tick(fakeAsyncTick);
  }

  subscription.unsubscribe();

  if (emitted === false) {
    throw new Error(
      `Expected ${observable} to emit after ticking for ${fakeAsyncTick}, but it never did.`
    );
  }
}
