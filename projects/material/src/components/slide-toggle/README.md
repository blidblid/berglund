# Example

```typescript
// slide-toggle.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergSlideToggleComponent } from '@berglund/material';

@Component({
  templateUrl: './slide-toggle.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleExampleComponent {
  component = component({
    component: BergSlideToggleComponent,
    inputs: {
      label: 'Check me',
    },
  });
}
```

```typescript
// slide-toggle.module.ts
import { NgModule } from '@angular/core';
import { BergSlideToggleModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { SlideToggleExampleComponent } from './slide-toggle.component';

@NgModule({
  declarations: [SlideToggleExampleComponent],
  exports: [SlideToggleExampleComponent],
  imports: [BergSlideToggleModule, BergOutletModule],
})
export class SlideToggleExampleModule {}
```

```html
<!-- slide-toggle.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
