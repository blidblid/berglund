# Example

```typescript
// select.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergSelectComponent } from '@berglund/material';

@Component({
  templateUrl: './select.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExampleComponent {
  component = component({
    component: BergSelectComponent,
    inputs: {
      label: 'Hero',
      data: [
        { name: 'Fei', element: 'Fire' },
        { name: 'Albin', element: 'Water' },
        { name: 'Noa', element: 'Earth' },
      ],
      pluckLabel: (value) => value.name,
      pluckDisabled: (value) => value.element === 'Fire',
      selection: 'multiple',
    },
  });
}
```

```typescript
// select.module.ts
import { NgModule } from '@angular/core';
import { BergSelectModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { SelectExampleComponent } from './select.component';

@NgModule({
  declarations: [SelectExampleComponent],
  exports: [SelectExampleComponent],
  imports: [BergSelectModule, BergOutletModule],
})
export class SelectExampleModule {}
```

```html
<!-- select.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
