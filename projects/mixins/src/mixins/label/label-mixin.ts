import { Observable } from 'rxjs';
import { Constructor, Mixin, MixinApi } from '../core';
import { Label } from './label-model';

interface LabelMixin extends MixinApi<Label> {}

export type LabelConstructor = Constructor<LabelMixin>;

/**
 * A labelled component uses text to guide the user.
 */
export function mixinLabel<T extends Constructor<Mixin<Label>>>(
  base: T
): LabelConstructor & T {
  return class extends base {
    hint: string | Observable<string>;
    _hint: string;
    _hint$ = this.defineAccessors('hint', '');

    label: string | Observable<string>;
    _label: string;
    _label$ = this.defineAccessors('label', '');

    ariaLabel: string | Observable<string>;
    _ariaLabel: string;
    _ariaLabel$ = this.defineAccessors('ariaLabel', '');

    ariaLabelledby: string | null | Observable<string | null>;
    _ariaLabelledby: string | null;
    _ariaLabelledby$ = this.defineAccessors('ariaLabelledby', null);

    placeholder: string | Observable<string>;
    _placeholder: string;
    _placeholder$ = this.defineAccessors('placeholder', '');

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
