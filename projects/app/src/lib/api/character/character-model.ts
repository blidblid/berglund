import { Entity } from '@berglund/firebase';

export interface Character extends Required<Entity> {
  /** Character name. */
  characterName: string;

  /** Lucky number. */
  luckyNumber: string;

  /** Favorite drink. */
  drinks: string;
}
