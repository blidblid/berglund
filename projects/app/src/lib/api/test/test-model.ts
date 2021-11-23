type Enum = 'A' | 'B' | 'C';

export interface Test {
  enum: Enum;
  string: string;
  number: number;
  null: null;

  numberArray: number[];
  enumArray: Enum[];
}
