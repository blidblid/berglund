# Example

```typescript
// radio.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergRadioComponent } from '@berglund/material';

@Component({
  templateUrl: './radio.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioExampleComponent {
  component = component({
    component: BergRadioComponent,
    inputs: {
      data: [
        { name: 'Fei', element: 'Fire' },
        { name: 'Albin', element: 'Water' },
        { name: 'Noa', element: 'Earth' },
      ],
      pluckLabel: (value) => value.element,
    },
  });
}
```

```typescript
// radio.module.ts
import { NgModule } from '@angular/core';
import { BergRadioModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { RadioExampleComponent } from './radio.component';

@NgModule({
  declarations: [RadioExampleComponent],
  exports: [RadioExampleComponent],
  imports: [BergRadioModule, BergOutletModule],
})
export class RadioExampleModule {}
```

```html
<!-- radio.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
