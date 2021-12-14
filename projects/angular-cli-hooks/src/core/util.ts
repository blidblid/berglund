export function isPromise<T>(value: any): value is Promise<T> {
  return 'then' in value;
}
