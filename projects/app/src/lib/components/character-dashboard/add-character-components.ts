import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BergButtonComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { ConnectedFormControl } from '@berglund/rx';
import { Rx } from '../../rx/rx';
import { CharacterModelComponents } from './model-components';

@Injectable({ providedIn: 'root' })
export class AddCharacterComponents {
  characterName = component(this.characterModelComponents.characterName, {
    formControl: new ConnectedFormControl(this.rx.character.add.characterName, [
      Validators.minLength(3),
      Validators.required,
    ]),
  });

  luckyNumber = component(this.characterModelComponents.luckyNumber, {
    connectToFormValue: this.rx.character.add.luckyNumber,
    formControl: new FormControl(null, Validators.required),
  });

  drinks = component(this.characterModelComponents.drinks, {
    connectToFormValue: this.rx.character.add.drinks,
    formControl: new FormControl(null, Validators.required),
  });

  trigger = component({
    component: BergButtonComponent,
    inputs: {
      disabled: this.rx.character.add.hasErrors$,
      connectToEvent: this.rx.character.add.trigger,
      label: 'Add',
      hint: 'Hints',
    },
  });

  all = [this.characterName, this.luckyNumber, this.drinks, this.trigger];

  constructor(
    private rx: Rx,
    private characterModelComponents: CharacterModelComponents
  ) {}
}
