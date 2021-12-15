import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Character } from '@app/api';
import { mergeValidationErrors } from '@berglund/mixins';
import {
  hasLength,
  mergeWith,
  triggeredUnflatten,
  UpdateValue,
  userInput,
  userTrigger,
} from '@berglund/rx';
import { Observable, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateCharacterStreams {
  selectedCharacter = userInput<Character>();
  removedCharacter = userInput<Character>();

  characterName = userInput<string>(
    this.selectedCharacter.pipe(pluck('characterName')),
    [Validators.minLength(3)]
  );

  luckyNumber = userInput<string>(
    this.selectedCharacter.pipe(pluck('luckyNumber')),
    [Validators.required]
  );

  drinks = userInput<string>(this.selectedCharacter.pipe(pluck('drinks')), [
    Validators.required,
  ]);

  trigger = userTrigger<MouseEvent>();

  errors$ = mergeWith(
    mergeValidationErrors,
    this.characterName.getErrors(),
    this.luckyNumber.getErrors(),
    this.drinks.getErrors()
  );

  hasErrors$ = this.errors$.pipe(hasLength());

  updatedCharacter = triggeredUnflatten(
    this.trigger,
    mockApi,
    switchMap,
    this.selectedCharacter,
    this.characterName,
    this.luckyNumber,
    this.drinks
  );
}

function mockApi(
  character: Character,
  characterName: string,
  luckyNumber: string,
  drinks: string
): Observable<UpdateValue<Character>> {
  return of({
    oldValue: character,
    newValue: {
      ...character,
      characterName,
      luckyNumber,
      drinks,
    },
  });
}
