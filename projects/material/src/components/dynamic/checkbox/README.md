# Example

```typescript
// checkbox.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergCheckboxComponent } from '@berglund/material';

@Component({
  templateUrl: './checkbox.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxExampleComponent {
  component = component({
    component: BergCheckboxComponent,
    inputs: {
      label: 'Check me',
    },
  });
}
```

```typescript
// checkbox.module.ts
import { NgModule } from '@angular/core';
import { BergCheckboxModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { CheckboxExampleComponent } from './checkbox.component';

@NgModule({
  declarations: [CheckboxExampleComponent],
  exports: [CheckboxExampleComponent],
  imports: [BergCheckboxModule, BergOutletModule],
})
export class CheckboxExampleModule {}
```

```html
<!-- checkbox.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
