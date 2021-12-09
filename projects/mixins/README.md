# Mixins

`@berglund/mixins` is a collection of [TypeScript mixins](https://www.typescriptlang.org/docs/handbook/mixins.html). The mixins form a middleware between apps and component libraries that aims to

- increase productivity
- reduce code duplication
- reduce developer freedom

Before getting into how, let's get into the upsides and downsides of traditional Angular component libraries.

## Traditional component libraries

### The upsides

A well-written Angular component library usually has:

- lots of content projection
- lots of directives

And you can see why, it is a very strong combination. The content projection maximizes component surface area, which the directives can attach to.

Take `mat-select` for example:

```html
<mat-form-field>
  <mat-label></mat-label>
  <mat-select>
    <mat-option></mat-option>
  </mat-select>
</mat-form-field>
```

Since the component has a large surface area, a `cdkDrag` directive could make the options rearrangeable. And an `*ngFor` directive could repeat `<mat-option>` over some data source. It is a powerful design, but the power comes at a cost.

To illustrate this cost, let's look at another material component, a [basic `mat-table`](https://material.angular.io/components/table/overview). At this point, its implementation is pretty simple, with some 50 odd lines of code. But tables usually have many requirements, such as

- sortable rows
- virtualized rows
- rearrangeable columns

Let's add these features to `mat-table` using directives from `@angular/material` and `@angular/cdk`

| Feature               |                   Directives                    |
| --------------------- | :---------------------------------------------: |
| Sortable rows         |           `matSort`, `matSortHeader`            |
| Virtualized rows      | `cdk-virtual-scroll-viewport`, `*cdkVirtualFor` |
| Rearrangeable columns |            `cdkDrag`, `cdkDropList`             |

Pretty smooth, but now the table is now hundreds of lines of code. And here lies the issue of traditional component libraries: large complicated templates. The problem with these templates is that they lead to

- code duplication
  - you either have to duplicate the template code in future tables...
  - ...or you have to create a table-wrapper component that propagates inputs
- few constraints
  - a developer _can_ attach directives, but _should_ they? In enterprise, large freedom can make UX diverge across apps
- technical bias
  - the code is overly focused on _how_ to solve a problem, not _what_ it's trying to solve. Let's say `mat-table` suddenly needs nested drag drop. Since `@angular/cdk/drag-drop` does not support that, the code needs massive refactoring
- poor dynamic support
  - neither Angular directives or `@ContentChildren` can attach dynamically

## The solution

Let's add another layer between apps and libraries. The goal is to design an API that is intent-driven and fully described by its inputs.

To do that, all content projection has to go. But without content projection, all directives have become worthless. For example, `*ngFor` as the abstraction that connects a data source to lists and selects, has become useless.

### Mixins

Without directives, the code base needs another source of reusability. Let's look at four components

- `mat-checkbox`
- `mat-select`
- `matInput`
- `mat-table`

and find their commonalities

| Feature              |                Component                 |
| -------------------- | :--------------------------------------: |
| Can have a label     | `mat-checkbox`, `mat-select`, `matInput` |
| Can show data        |        `mat-select`, `mat-table`         |
| Can select           |               `mat-select`               |
| Can have state       | `mat-checkbox`, `mat-select`, `matInput` |
| Can render templates |                `matTable`                |
| Can be disabled      | `mat-checkbox`, `mat-select`, `matInput` |

and implement classes for each of the listed features. Then, use TypeScript mixins to compose a base. There are existing bases for components in `@berglund/mixins`, but let's create a couple of new ones:

```typescript
const TableBase = mixinComponentOutlet(mixinCollection(_TableBase));
const SelectBase = mixinConnectable(
  mixinAccessible(mixinLabel(mixinCollection(_SelectBase)))
);
```

```typescript
@Component({
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends SelectBase {}
```

Here, the template in `select.component.html` implements the mixin API using a design system. Meanwhile, the app now uses the mixin API over the previous API.

This is how a select would look like using `@berglund/material`

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

As you can see, the API is

- \+ intent-focused
- \+ reusable, components are easily reused since they are described as objects
- \- stiff. You cannot even add a `(click)`-binding. Everything has to be described in the mixin-API

### Final thoughts

Is a middleware between apps and component libraries is a good idea for your code? It depends on the context. If you're working on a hobby-project, the constraints would probably be too frustrating. But if you're working in a company with multiple apps, then a middleware using mixins would do a lot for productivity and unified UX.
