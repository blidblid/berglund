export type Flatten<T> = T extends (infer I)[] ? I : never;
