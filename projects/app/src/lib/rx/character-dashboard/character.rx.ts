import { Injectable } from '@angular/core';
import { arrayReducer } from '@berglund/rx';
import { AddCharacterRx } from './add-character.rx';
import { SelectedCharacterRx } from './selected-character.rx';
import { UpdateCharacterRx } from './update-character.rx';

@Injectable({ providedIn: 'root' })
export class CharacterRx {
  characters = arrayReducer({
    add: this.add.addedCharacter,
    update: this.update.updatedCharacter,
    remove: this.update.removedCharacter,
  });

  constructor(
    public add: AddCharacterRx,
    public update: UpdateCharacterRx,
    public selected: SelectedCharacterRx
  ) {}
}
