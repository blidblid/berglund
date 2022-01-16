import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BergButtonComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { Streams } from '../../streams/streams';
import { CharacterModelComponents } from './model-components';

@Injectable({ providedIn: 'root' })
export class UpdateCharacterComponents {
  characterName = component(this.characterModelComponents.characterName, {
    connectToFormValue: this.streams.character.update.characterName,
    formControl: new FormControl(),
  });

  luckyNumber = component(this.characterModelComponents.luckyNumber, {
    connectToFormValue: this.streams.character.update.luckyNumber,
    formControl: new FormControl(),
  });

  drinks = component(this.characterModelComponents.drinks, {
    connectToFormValue: this.streams.character.update.drinks,
    formControl: new FormControl(),
  });

  trigger = component({
    component: BergButtonComponent,
    inputs: {
      style: 'label',
      label: 'Update',
      disabled: this.streams.character.update.hasErrors$,
      connectToEvent: this.streams.character.update.trigger,
    },
  });

  all = [this.characterName, this.luckyNumber, this.drinks, this.trigger];

  constructor(
    private streams: Streams,
    private characterModelComponents: CharacterModelComponents
  ) {}
}
