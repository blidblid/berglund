import { Injectable } from '@angular/core';
import { arrayReducer } from '@berglund/rx';
import { AddCharacterStreams } from './add-character-streams';
import { SelectedCharacterStreams } from './selected-character-streams';
import { UpdateCharacterStreams } from './update-character-streams';

@Injectable({ providedIn: 'root' })
export class CharacterStreams {
  characters = arrayReducer({
    add: this.add.addedCharacter,
    update: this.update.updatedCharacter,
    remove: this.update.removedCharacter,
  });

  constructor(
    public add: AddCharacterStreams,
    public update: UpdateCharacterStreams,
    public selected: SelectedCharacterStreams
  ) {}
}
