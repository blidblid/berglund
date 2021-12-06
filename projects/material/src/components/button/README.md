# Example

```typescript
// button.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergButtonComponent } from '@berglund/material';

@Component({
  templateUrl: './button.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonExampleComponent {
  component = component({
    component: BergButtonComponent,
    inputs: {
      label: 'Click me',
    },
  });
}
```

```typescript
// button.module.ts
import { NgModule } from '@angular/core';
import { BergButtonModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { ButtonExampleComponent } from './button.component';

@NgModule({
  declarations: [ButtonExampleComponent],
  exports: [ButtonExampleComponent],
  imports: [BergButtonModule, BergOutletModule],
})
export class ButtonExampleModule {}
```

```html
<!-- button.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
