# Example

```typescript
// calendar.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergCalendarComponent } from '@berglund/material';

@Component({
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarExampleComponent {
  component = component({
    component: BergCalendarComponent,
  });
}
```

```typescript
// calendar.module.ts
import { NgModule } from '@angular/core';
import { BergCalendarModule } from '@berglund/material';
import { BergOutletModule } from '@berglund/mixins';
import { CalendarExampleComponent } from './calendar.component';

@NgModule({
  declarations: [CalendarExampleComponent],
  exports: [CalendarExampleComponent],
  imports: [BergCalendarModule, BergOutletModule],
})
export class CalendarExampleModule {}
```

```html
<!-- calendar.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```
