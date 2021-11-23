import { Observable } from 'rxjs';

export function fromCallback<T = any>(
  registerCallback: (callback: (value: T) => void) => void
): Observable<T> {
  return new Observable((observer) => {
    registerCallback((value) => observer.next(value));
  });
}
