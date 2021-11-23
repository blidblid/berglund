import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ProjectApi } from '../../api/project/project-service';
import { SelectedCharacterStreams } from '../character-dashboard';

@Injectable({ providedIn: 'root' })
export class CharacterTimeReportStreams {
  projects = this.selectedCharacter.selectedCharacter.pipe(
    switchMap((character) => this.projectApi.get(character.id))
  );

  constructor(
    private selectedCharacter: SelectedCharacterStreams,
    private projectApi: ProjectApi
  ) {}
}
