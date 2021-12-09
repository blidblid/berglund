# Error pipe

Error pipe transforms `ValidationError` into a readable string.

## Showing errors

```typescript
// error-pipe.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './error-pipe.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPipeExampleComponent {
  formControl = new FormControl(10, Validators.min(100));
  errors = this.formControl.errors;
}
```

```typescript
// error-pipe.module.ts
import { NgModule } from '@angular/core';
import { ErrorPipeModule } from '@berglund/mixins';
import { ErrorPipeExampleComponent } from './error-pipe.component';

@NgModule({
  declarations: [ErrorPipeExampleComponent],
  exports: [ErrorPipeExampleComponent],
  imports: [ErrorPipeModule],
})
export class ErrorPipeExampleModule {}
```

```html
<!-- error-pipe.component.html -->
{{ errors | error }}
```
