import { Injectable } from '@angular/core';
import { Character } from '@app/api';
import { userValue } from '@berglund/rx';

@Injectable({ providedIn: 'root' })
export class SelectedCharacterRx {
  selectedCharacter = userValue<Character>();
}
