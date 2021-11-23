# Example

```typescript
// textarea.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergTextareaComponent } from '@berglund/material';

@Component({
  templateUrl: './textarea.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExampleComponent {
  component = component({
    component: BergTextareaComponent,
    inputs: {
      label: 'Shopping list',
      minRows: 4,
      maxRows: 7,
    },
  });
}
```

```typescript
// textarea.module.ts
import { NgModule } from '@angular/core';
import { BergTextareaModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { TextareaExampleComponent } from './textarea.component';

@NgModule({
  declarations: [TextareaExampleComponent],
  exports: [TextareaExampleComponent],
  imports: [BergTextareaModule, BergOutletModule],
})
export class TextareaExampleModule {}
```

```html
<!-- textarea.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
