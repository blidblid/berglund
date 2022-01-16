import { Injectable } from '@angular/core';
import { Character } from '@app/api';
import { mergeValidationErrors } from '@berglund/mixins';
import {
  hasLength,
  mergeWith,
  triggeredUnflatten,
  UpdateValue,
  userError,
  userTrigger,
  userValue,
} from '@berglund/rx';
import { Observable, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateCharacterStreams {
  selectedCharacter = userValue<Character>();
  removedCharacter = userValue<Character>();

  characterName = userValue<string>(
    this.selectedCharacter.pipe(pluck('characterName'))
  );

  luckyNumber = userValue<string>(
    this.selectedCharacter.pipe(pluck('luckyNumber'))
  );

  drinks = userValue<string>(this.selectedCharacter.pipe(pluck('drinks')));
  trigger = userTrigger();

  drinksError = userError();
  characterNameError = userError();
  luckyNumberError = userError();

  errors$ = mergeWith(
    mergeValidationErrors,
    this.characterNameError,
    this.luckyNumberError,
    this.drinksError
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
