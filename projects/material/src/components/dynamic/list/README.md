# Example

```typescript
// list.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergListComponent } from '@berglund/material';

@Component({
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListExampleComponent {
  component = component({
    component: BergListComponent,
    inputs: {
      data: [
        { name: 'Fei', element: 'Fire' },
        { name: 'Albin', element: 'Water' },
        { name: 'Noa', element: 'Earth' },
      ],
      pluckLabel: (value) => value.name,
      pluckDisabled: (value) => value.element === 'Fire',
    },
  });
}
```

```typescript
// list.module.ts
import { NgModule } from '@angular/core';
import { BergListModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { ListExampleComponent } from './list.component';

@NgModule({
  declarations: [ListExampleComponent],
  exports: [ListExampleComponent],
  imports: [BergListModule, BergOutletModule],
})
export class ListExampleModule {}
```

```html
<!-- list.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
