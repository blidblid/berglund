export type IncludeType<T, K> = {
  [P in keyof T]: T[P] extends K ? T[P] : never;
};

export type IncludeArray<T> = T | T[];

export type OmitPrivates<T> = {
  [K in keyof T as K extends `_${any}` ? never : K]: T[K];
};

export type OmitType<T, O> = Omit<T, keyof O>;

export type ValueOf<T> = T[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

export type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>]
  ? U
  : never;
