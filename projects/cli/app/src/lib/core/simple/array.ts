export function ensureArray<T>(arr: T[] | T | null | undefined): T[] {
  return Array.isArray(arr)
    ? arr
    : arr === null || arr === undefined
      ? []
      : [arr];
}

export function array(size: number): null[] {
  return Array(size).fill(null);
}

export function arrayToTuple<T>(arr: T[]): [T, T][] {
  return arr.reduce((acc, _, index) => {
    if (index % 2 === 0) {
      return [
        ...acc,
        [arr[index], arr[index + 1]]
      ];
    }

    return acc;
  }, []);
}
