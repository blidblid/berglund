import { Injectable } from '@angular/core';
import { Character } from '@app/api';
import { ModelComponents } from '@berglund/components';
import { BergInputComponent, BergSelectComponent } from '@berglund/material';
import { component } from '@berglund/mixins';

@Injectable({ providedIn: 'root' })
export class CharacterModelComponents
  implements ModelComponents<Character, 'id'>
{
  characterName = component({
    component: BergInputComponent,
    inputs: {
      label: 'Character name',
    },
  });

  luckyNumber = component({
    component: BergInputComponent,
    inputs: {
      label: 'Lucky number',
    },
  });

  drinks = component({
    component: BergSelectComponent,
    inputs: {
      label: 'Drinks',
      data: ['Coffee', 'Tea'],
    },
  });
}
