import { Injectable } from '@angular/core';
import { BergButtonComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { Streams } from '../../streams/streams';
import { CharacterModelComponents } from './model-components';

@Injectable({ providedIn: 'root' })
export class AddCharacterComponents {
  characterName = component(this.characterModelComponents.characterName, {
    connect: this.streams.character.add.characterName,
  });

  luckyNumber = component(this.characterModelComponents.luckyNumber, {
    connect: this.streams.character.add.luckyNumber,
  });

  drinks = component(this.characterModelComponents.drinks, {
    connect: this.streams.character.add.drinks,
  });

  trigger = component({
    component: BergButtonComponent,
    inputs: {
      connect: this.streams.character.add.trigger,
      disabled: this.streams.character.add.hasErrors$,
      label: 'Add',
      hint: 'Hints',
    },
  });

  all = [this.characterName, this.luckyNumber, this.drinks, this.trigger];

  constructor(
    private streams: Streams,
    private characterModelComponents: CharacterModelComponents
  ) {}
}
