import { Injectable } from '@angular/core';
import { AddCharacterComponents } from './add-character-components';
import { PresentCharacterComponents } from './present-character-components';
import { UpdateCharacterComponents } from './update-character-components';

@Injectable({ providedIn: 'root' })
export class CharacterComponents {
  constructor(
    public add: AddCharacterComponents,
    public update: UpdateCharacterComponents,
    public present: PresentCharacterComponents
  ) {}
}
