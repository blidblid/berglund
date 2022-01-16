import { FormControl } from '@angular/forms';
import { UserValueSubject } from '@berglund/rx';

export type UserInputForm<T> = ReplaceUserInput<T, FormControl>;

export type ReplaceUserInput<T, O> = ReplaceProperties<
  T,
  UserValueSubject<any>,
  O
>;

export type ReplaceProperties<T, I, O> = {
  [P in keyof T]: T[P] extends I ? O : null;
};
