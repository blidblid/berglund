# Example

```typescript
// table.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergTableComponent } from '@berglund/material';

@Component({
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent {
  component = component({
    component: BergTableComponent,
    inputs: {
      data: [
        { name: 'Fei', element: 'Fire' },
        { name: 'Albin', element: 'Water' },
        { name: 'Noa', element: 'Earth' },
      ],
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'element', label: 'Element' },
      ],
    },
  });
}
```

```typescript
// table.module.ts
import { NgModule } from '@angular/core';
import { BergTableModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { TableExampleComponent } from './table.component';

@NgModule({
  declarations: [TableExampleComponent],
  exports: [TableExampleComponent],
  imports: [BergTableModule, BergOutletModule],
})
export class TableExampleModule {}
```

```html
<!-- table.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
