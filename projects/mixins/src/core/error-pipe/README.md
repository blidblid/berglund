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
import { ErrorPipeModule } from '@berglund/components';
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

## Adding handlers

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |