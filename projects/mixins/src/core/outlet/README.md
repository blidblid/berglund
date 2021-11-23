# Outlet

Outlet creates components and sets their inputs.

## One component

```typescript
// outlet.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergInputComponent } from '@berglund/material';

@Component({
  templateUrl: './outlet.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletExampleComponent {
  component = component({
    component: BergInputComponent,
    inputs: {
      label: 'Lucky number',
    },
  });
}
```

```typescript
// outlet.module.ts
import { NgModule } from '@angular/core';
import { BergOutletModule } from '@berglund/mixins';
import { OutletExampleComponent } from './outlet.component';

@NgModule({
  declarations: [OutletExampleComponent],
  exports: [OutletExampleComponent],
  imports: [BergOutletModule],
})
export class OutletExampleModule {}
```

```html
<!-- outlet.component.html -->
<berg-outlet [component]="component"></berg-outlet>
```

## Many components

```typescript
// outlet-multiple.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergInputComponent } from '@berglund/material';

@Component({
  templateUrl: './outlet-multiple.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletMultipleExampleComponent {
  component = component({
    component: BergInputComponent,
    inputs: {
      label: 'Lucky number',
    },
  });

  otherComponent = component(this.component, {
    disabled: true,
    label: 'Unlucky number',
  });
}
```

```typescript
// outlet-multiple.module.ts
import { NgModule } from '@angular/core';
import { BergOutletModule } from '@berglund/mixins';
import { OutletMultipleExampleComponent } from './outlet-multiple.component';

@NgModule({
  declarations: [OutletMultipleExampleComponent],
  exports: [OutletMultipleExampleComponent],
  imports: [BergOutletModule],
})
export class OutletMultipleExampleModule {}
```

```html
<!-- outlet-multiple.component.html -->
<berg-outlet [component]="[component, otherComponent]"></berg-outlet>
```
