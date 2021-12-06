# Example

```typescript
// datepicker.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergDatepickerComponent } from '@berglund/material';

@Component({
  templateUrl: './datepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerExampleComponent {
  component = component({
    component: BergDatepickerComponent,
    inputs: {
      label: 'Pick a date',
    },
  });
}
```

```typescript
// datepicker.module.ts
import { NgModule } from '@angular/core';
import { BergDatepickerModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { DatepickerExampleComponent } from './datepicker.component';

@NgModule({
  declarations: [DatepickerExampleComponent],
  exports: [DatepickerExampleComponent],
  imports: [BergDatepickerModule, BergOutletModule],
})
export class DatepickerExampleModule {}
```

```html
<!-- datepicker.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
