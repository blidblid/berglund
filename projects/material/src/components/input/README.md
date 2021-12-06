# Example

```typescript
// input.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergInputComponent } from '@berglund/material';

@Component({
  templateUrl: './input.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputExampleComponent {
  component = component({
    component: BergInputComponent,
    inputs: {
      label: 'User',
    },
  });
}
```

```typescript
// input.module.ts
import { NgModule } from '@angular/core';
import { BergInputModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { InputExampleComponent } from './input.component';

@NgModule({
  declarations: [InputExampleComponent],
  exports: [InputExampleComponent],
  imports: [BergInputModule, BergOutletModule],
})
export class InputExampleModule {}
```

```html
<!-- input.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
