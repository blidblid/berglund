import { Injectable } from '@angular/core';
import { Character } from '@app/api';
import { userInput } from '@berglund/rx';

@Injectable({ providedIn: 'root' })
export class SelectedCharacterStreams {
  selectedCharacter = userInput<Character>();
}
