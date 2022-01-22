import { FormControl, ValidationErrors } from '@angular/forms';
import { MixinComponent } from '@berglund/mixins';
import { Observable } from 'rxjs';

export interface GeneratedFormOutput {
  value$: Observable<Record<string, any>>;
  error$: Observable<ValidationErrors | null>;
  isValid$: Observable<boolean>;
}

export interface GeneratedForm extends GeneratedFormOutput {
  items: GeneratedFormItem[];
}

export interface GeneratedFormItem extends GeneratedFormOutput {
  key: string;
  component: MixinComponent;
  formControl: FormControl;
}
