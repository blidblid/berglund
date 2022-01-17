import { Injectable } from '@angular/core';
import { Character } from '@app/api';
import { mergeValidationErrors } from '@berglund/mixins';
import {
  hasLength,
  mergeWith,
  triggeredUnflatten,
  userError,
  userTrigger,
  userValue,
} from '@berglund/rx';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddCharacterRx {
  characterName = userValue<string>();
  luckyNumber = userValue<string>();
  drinks = userValue<string>();
  trigger = userTrigger<MouseEvent>();

  characterNameErrors = userError();
  luckyNumberErrors = userError();
  drinksErrors = userError();
  triggerErrors = userError();

  addedCharacter = userValue(
    triggeredUnflatten(
      this.trigger,
      mockApi,
      switchMap,
      this.characterName,
      this.luckyNumber,
      this.drinks
    )
  );

  errors$ = mergeWith(
    mergeValidationErrors,
    this.characterNameErrors,
    this.luckyNumberErrors,
    this.drinksErrors
  );

  hasErrors$ = this.errors$.pipe(hasLength());

  constructor() {
    setTimeout(() => {
      for (const mock of MOCK_DATA) {
        this.addedCharacter.next(mock);
      }
    });
  }
}

let id = 3;

function mockApi(
  characterName: string,
  luckyNumber: string,
  drinks: string
): Observable<Character> {
  return of({ characterName, luckyNumber, drinks, id: `${id++}` });
}

const MOCK_DATA: Character[] = [
  {
    characterName: 'blid',
    luckyNumber: '17',
    drinks: 'Tea',
    id: '1',
  },
  {
    characterName: 'imbehfisken',
    luckyNumber: '666',
    drinks: 'Coffee',
    id: '2',
  },
  {
    characterName: 'feisoup',
    luckyNumber: '888',
    drinks: 'Coffee',
    id: '3',
  },
];
