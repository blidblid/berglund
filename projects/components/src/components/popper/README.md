# Popper

A popover built on top of `@angular/cdk`. It supports all types of content, including

- strings
- TemplateRef
- Components

```typescript
// popper.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BergPopperComponent } from '@berglund/material';

@Component({
  templateUrl: './popper.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopperExampleComponent {}
```

```typescript
// popper.module.ts
import { NgModule } from '@angular/core';
import { BergPopperModule } from '@berglund/components';
import { PopperExampleComponent } from './popper.component';

@NgModule({
  declarations: [PopperExampleComponent],
  exports: [PopperExampleComponent],
  imports: [BergPopperModule],
})
export class PopperExampleModule {}
```

```html
<!-- popper.component.html -->
<button mat-button bergPopper="What's popping?">With text</button>
```

## Customization

The best way to customize the popover is to provide the injection token `BERG_POPPER_DEFAULT_INPUTS`. That way, every created popover will have the same behavior.
