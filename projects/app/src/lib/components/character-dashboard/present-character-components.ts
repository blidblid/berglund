import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Character } from '@app/api';
import {
  BergButtonComponent,
  BergListComponent,
  BergTableComponent,
} from '@berglund/material';
import { component, components } from '@berglund/mixins';
import { map, shareReplay } from 'rxjs/operators';
import { Streams } from '../../streams/streams';
import { UpdateCharacterComponents } from './update-character-components';

@Injectable({ providedIn: 'root' })
export class PresentCharacterComponents {
  actions = components(
    {
      component: BergButtonComponent,
      inputs: {
        style: 'icon',
        label: 'edit',
        connect: this.streams.character.update.selectedCharacter,
      },
    },
    {
      component: BergButtonComponent,
      inputs: {
        style: 'icon',
        label: 'delete',
        connect: this.streams.character.update.removedCharacter,
      },
    }
  );

  table = component({
    component: BergTableComponent,
    inputs: {
      data: this.streams.character.characters,
      placeholder: 'No characters yet.',
      columns: [
        { key: 'characterName', label: 'Character name' },
        { key: 'luckyNumber', label: 'Lucky number' },
        { key: 'drinks', label: 'Drinks' },
      ],
      expandRowComponent: {
        value: this.streams.character.update.selectedCharacter,
        component: this.updateCharacterComponents.all,
      },
      getProjectedComponent: () => this.actions,
    },
  });

  list = component({
    component: BergListComponent,
    inputs: {
      data: this.streams.character.characters,
      pluckLabel: 'characterName',
      connect: this.streams.character.selected.selectedCharacter,
      getValueFromRoute: this.streams.character.characters.pipe(
        map((characters) => {
          return (activatedRoute: ActivatedRouteSnapshot) => {
            const character = characters.find((c) => {
              return (
                activatedRoute.queryParamMap.get('characterName') ===
                c.characterName
              );
            });

            return character ? [character] : [];
          };
        }),
        shareReplay(1)
      ),
      updateRouteFromValue: (value: Character | null, router: Router) => {
        void router.navigate([], {
          queryParams: {
            characterName: value?.characterName,
          },
        });
      },
    },
  });

  constructor(
    private streams: Streams,
    private updateCharacterComponents: UpdateCharacterComponents
  ) {}
}
