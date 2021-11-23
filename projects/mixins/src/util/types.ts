export type ExcludeType<T, K> = {
  [P in keyof T]: T[P] extends K ? never : T[P];
}[keyof T];

export type IncludeType<T, K> = {
  [P in keyof T]: T[P] extends K ? T[P] : never;
};

export type PickType<T, K> = Pick<T, Exclude<keyof T, ExcludeType<T, K>>>;

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ExtractReturn<T> = T extends (value: any) => infer R ? R : never;

export type IncludeArray<T> = T | T[];

export type OmitPrivates<T> = {
  [K in keyof T as K extends `_${any}` ? never : K]: T[K];
};

export type OmitType<T, O> = Omit<T, keyof O>;
