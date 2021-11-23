# Mixins

`@berglund/mixins` is not a component library, it's another layer between apps and component libraries that aims to

- increase productivity
- reduce code duplication

But before getting into how, let's get into the upside and downside of traditional Angular component libraries.

## Traditional component libraries

### The upsides

A well-written Angular component library usually has two design patterns:

- Lots of content projection
- Lots of directives

And you can see why - it is a strong combination. The content projection maximizes component surface area, which the directives can attach to. Any new `@Directive` can be used everywhere!

Take `mat-select` for example:

```html
<mat-form-field>
  <mat-label></mat-label>
  <mat-select>
    <mat-option></mat-option>
  </mat-select>
</mat-form-field>
```

Since the component has surface area, a `cdkDrag` directive could make the options rearrangeable.
It is a powerful design, but what is the cost?

### The downsides

Complexity has moved out of libraries and into apps.

#### Directive hell

Let's look at [basic `mat-table`](https://material.angular.io/components/table/overview).
At this point, its implementation is pretty simple, with some 50 odd lines of code. But tables usually have many requirements, such as

- sortable rows
- virtualized rows
- rearrangeable columns

Let's add these features to `mat-table` using directives from `@angular/material` and `@angular/cdk`

| Feature               |                   Directives                    |
| --------------------- | :---------------------------------------------: |
| Sortable rows         |           `matSort`, `matSortHeader`            |
| Virtualized rows      | `cdk-virtual-scroll-viewport`, `*cdkVirtualFor` |
| Rearrangeable columns |            `cdkDrag`, `cdkDropList`             |

Pretty smooth, but now the basic table is now hundred of lines of code.

#### Unhinged freedom

When the app owns the template, it can do a lot. In the `mat-table` example above, the app could

- Implement state through two bindings:
  - `[class.mat-row-selected]="row === selectedRow"`
  - `(click)="selectedRow = row"`.
- Add keyboard navigation using `FocusKeyManager`

But should it? If you're working on a hobby project, then by all means, go ahead.
But if you're working in an organization, any such implementation is a hack.
In fact, that goes for any app-side modification of framework level components.

#### Repetition

If the app wants to modify the table above, then it has to create a wrapper component and create inputs.
Before long, a large part of the codebase will be `@Input()` annotations that just propagate. It's not DRY.
But if the component was described as an _object_, then the sky's the limit

```typescript
editUserComponent = component({
  component: BergInputComponent,
  inputs: {
    label: 'Edit user',
    disabled: this.disabled$,
  },
});

createUserComponent = component(this.editUserComponent, {
  label: 'Create user ',
});
```

## The solution

Let's add another layer between apps and libraries.

The goal is to design an API without templates. To do that, all content projection needs to go.
Then, there's a massive headache to address: all directives are now worthless. The library has a lot of reusability.

### Mixins to the rescue

Without directives, the code base needs another source of reusability. Let's look at four components

- `mat-checkbox`
- `mat-select`
- `matInput`
- `mat-table`

and isolate their commonalities

| Feature              |                Component                 |
| -------------------- | :--------------------------------------: |
| Can have a label     | `mat-checkbox`, `mat-select`, `matInput` |
| Can show data        |        `mat-select`, `mat-table`         |
| Can select           |               `mat-select`               |
| Can edit             |        `matInput`, `mat-checkbox`        |
| Can render templates |                `matTable`                |
| Can be disabled      | `mat-checkbox`, `mat-select`, `matInput` |

then, after implementing mixins for each of these features, compose bases

```typescript
const BergSelectBase = mixinAccessible(
  mixinLabel(
    mixinCollection<typeof _BergSelectBase, 'radio' | 'multiple'>(
      _BergSelectBase
    )
  )
);
```

that can be used in component development

```typescript
@Component({
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'berg-select',
  },
})
export class BergSelectComponent extends BergSelectBase {}
```

and voila, no more templates! The component is fully described by its inputs.

```typescript
// select-mixin.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { component } from '@berglund/mixins';
import { BergSelectComponent } from '@berglund/material';

@Component({
  templateUrl: './select-mixin.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMixinExampleComponent {
  drinks = component({
    component: BergSelectComponent,
    inputs: {
      label: 'Drinks',
      data: ['Coffee', 'Tea'],
    },
  });

  eveningDrinks = component(this.drinks, { data: ['Beer', 'Wine'] });
}
```

```typescript
// select-mixin.module.ts
import { NgModule } from '@angular/core';
import { BergOutletModule } from '@berglund/mixins';
import { SelectMixinExampleComponent } from './select-mixin.component';

@NgModule({
  declarations: [SelectMixinExampleComponent],
  exports: [SelectMixinExampleComponent],
  imports: [BergOutletModule],
})
export class SelectMixinExampleModule {}
```

```html
<!-- select-mixin.component.html -->
<berg-outlet [component]="drinks"></berg-outlet>
<berg-outlet [component]="eveningDrinks"></berg-outlet>
```
