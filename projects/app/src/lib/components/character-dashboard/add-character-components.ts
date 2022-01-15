import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BergButtonComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { ConnectedFormControl } from '@berglund/rx';
import { Streams } from '../../streams/streams';
import { CharacterModelComponents } from './model-components';

@Injectable({ providedIn: 'root' })
export class AddCharacterComponents {
  characterName = component(this.characterModelComponents.characterName, {
    formControl: new ConnectedFormControl(
      this.streams.character.add.characterName
    ),
  });

  luckyNumber = component(this.characterModelComponents.luckyNumber, {
    connectToForm: this.streams.character.add.luckyNumber,
    formControl: new FormControl(),
  });

  drinks = component(this.characterModelComponents.drinks, {
    connectToForm: this.streams.character.add.drinks,
    formControl: new FormControl(),
  });

  trigger = component({
    component: BergButtonComponent,
    inputs: {
      disabled: this.streams.character.add.hasErrors$,
      connectToEvent: this.streams.character.add.trigger,
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
