import { Injectable } from '@angular/core';
import { BergButtonComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { Streams } from '../../streams/streams';
import { CharacterModelComponents } from './model-components';

@Injectable({ providedIn: 'root' })
export class UpdateCharacterComponents {
  characterName = component(this.characterModelComponents.characterName, {
    connect: this.streams.character.update.characterName,
  });

  luckyNumber = component(this.characterModelComponents.luckyNumber, {
    connect: this.streams.character.update.luckyNumber,
  });

  drinks = component(this.characterModelComponents.drinks, {
    connect: this.streams.character.update.drinks,
  });

  trigger = component({
    component: BergButtonComponent,
    inputs: {
      style: 'label',
      label: 'Update',
      connect: this.streams.character.update.trigger,
      disabled: this.streams.character.update.hasErrors$,
    },
  });

  all = [this.characterName, this.luckyNumber, this.drinks, this.trigger];

  constructor(
    private streams: Streams,
    private characterModelComponents: CharacterModelComponents
  ) {}
}
