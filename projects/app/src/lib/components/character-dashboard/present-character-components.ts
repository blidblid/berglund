import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BergButtonComponent,
  BergListComponent,
  BergTableComponent,
} from '@berglund/material';
import { component } from '@berglund/mixins';
import { Rx } from '../../rx/rx';
import { UpdateCharacterComponents } from './update-character-components';

@Injectable({ providedIn: 'root' })
export class PresentCharacterComponents {
  actions = [
    component({
      component: BergButtonComponent,
      inputs: {
        style: 'icon',
        label: 'edit',
        connectToEvent: this.rx.character.update.selectedCharacter,
      },
    }),
    component({
      component: BergButtonComponent,
      inputs: {
        style: 'icon',
        label: 'delete',
        connectToEvent: this.rx.character.update.removedCharacter,
      },
    }),
  ];

  table = component({
    component: BergTableComponent,
    inputs: {
      data: this.rx.character.characters,
      placeholder: 'No characters yet.',
      columns: [
        { key: 'characterName', label: 'Character name' },
        { key: 'luckyNumber', label: 'Lucky number' },
        { key: 'drinks', label: 'Drinks' },
      ],
      expandRowComponent: {
        value: this.rx.character.update.selectedCharacter,
        component: this.updateCharacterComponents.all,
      },
      getProjectedComponent: () => this.actions,
    },
  });

  list = component({
    component: BergListComponent,
    inputs: {
      data: this.rx.character.characters,
      pluckLabel: 'characterName',
      connectToFormValue: this.rx.character.selected.selectedCharacter,
      formControl: new FormControl(),
    },
  });

  constructor(
    private rx: Rx,
    private updateCharacterComponents: UpdateCharacterComponents
  ) {}
}
