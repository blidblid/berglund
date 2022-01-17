import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ProjectApi } from '../../api/project/project-service';
import { SelectedCharacterRx } from '../character-dashboard';

@Injectable({ providedIn: 'root' })
export class CharacterTimeReportRx {
  projects = this.selectedCharacter.selectedCharacter.pipe(
    switchMap((character) => this.projectApi.get(character.id))
  );

  constructor(
    private selectedCharacter: SelectedCharacterRx,
    private projectApi: ProjectApi
  ) {}
}
