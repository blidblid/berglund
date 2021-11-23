import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Character } from '@app/api';
import { mergeValidationErrors } from '@berglund/mixins';
import {
  hasLength,
  mergeWith,
  triggeredUnflatten,
  userInput,
  userTrigger,
} from '@berglund/rx';
import { EMPTY, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddCharacterStreams {
  characterName = userInput<string>(EMPTY, [
    Validators.minLength(3),
    Validators.required,
  ]);

  luckyNumber = userInput<string>(EMPTY, [Validators.required]);
  drinks = userInput<string>(EMPTY, [Validators.required]);
  trigger = userTrigger<MouseEvent>();

  addedCharacter = userInput(
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
    this.characterName.getErrors(),
    this.luckyNumber.getErrors(),
    this.drinks.getErrors()
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
