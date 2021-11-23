import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const NAVIGATOR_RESET_TIME = 2000;

export const NAVIGATOR_TARGETS = new InjectionToken<
  Observable<NavigatorTarget[]> | NavigatorTarget[]
>('Navigator targets');

export const NAVIGATOR_BANNED_TAG_NAMES = ['INPUT', 'TEXTAREA'];

export interface NavigatorTarget {
  match: string;
  url: string;
}
