# Mixins

`@berglund/mixins` is a collection of [TypeScript mixins](https://www.typescriptlang.org/docs/handbook/mixins.html). The mixins form a layer between apps and component libraries that aims to

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

### The downsides

Let's look at another material component, a [basic `mat-table`](https://material.angular.io/components/table/overview). At this point, its implementation is pretty simple, with some 50 odd lines of code. But tables usually have many requirements, such as

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
- poor serialization
  - since the API is partly described by templates, components cannot be serialized. This makes mapping models, such as `JsonSchema`, to components very difficult.

## The solution

Let's add another layer between apps and libraries. The goal is a programmatic API that and fully described by its inputs, and not at all by the template.

To achieve that, all content projection has to go. But without content projection, the layer loses a lot of reusability. It can no longer can delegate functionality to directives. Instead, it has to to describe all functionality in its API.

### Mixins

To find another source of reusability, let's look at four components

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

and implement classes for each of the listed features. Then, use TypeScript mixins to compose a base. There are existing bases for components in `@berglund/mixins`, but let's create a couple of new ones.

```typescript
const TableBase = mixinComponentOutlet(mixinCollection(_TableBase));
const SelectBase = mixinConnectable(
  mixinAccessible(mixinLabel(mixinSelection(mixinCollection(_SelectBase))))
);
```

The base is then ready to be used in a component.

```typescript
@Component({
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends SelectBase {}
```

Here, the template in `select.component.html` implements the mixin API using a design system. The app will now uses the mixin API over the previous API.

This is how a select would look like using `@berglund/material`

```typescript
// select-mixin.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  templateUrl: './select-mixin.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMixinExampleComponent {}
```

```html
<!-- select-mixin.component.html -->
<berg-select label="Drinks" [data]="['Coffee', 'Tea']"></berg-select>
```

```typescript
// select-mixin.module.ts
import { NgModule } from '@angular/core';
import { BergSelectModule } from '@berglund/material';
import { SelectMixinExampleComponent } from './select-mixin.component';

@NgModule({
  declarations: [SelectMixinExampleComponent],
  exports: [SelectMixinExampleComponent],
  imports: [BergSelectModule],
})
export class SelectMixinExampleModule {}
```

Or if you wanted to increase reusability and declare the inputs programmatically

```typescript
// select-mixin-programmatic.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BergSelectComponent } from '@berglund/material';
import { component } from '@berglund/mixins';
import { of } from 'rxjs';

@Component({
  templateUrl: './select-mixin-programmatic.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMixinProgrammaticExampleComponent {
  drinks = component({
    component: BergSelectComponent,
    inputs: {
      label: 'Drinks',
      data: ['Coffee', 'Tea'],
    },
  });

  eveningDrinks = component(this.drinks, { data: of(['Beer', 'Wine']) });
}
```

```html
<!-- select-mixin-programmatic.component.html -->
<berg-outlet [component]="drinks"></berg-outlet>
<berg-outlet [component]="eveningDrinks"></berg-outlet>
```

```typescript
// select-mixin-programmatic.module.ts
import { NgModule } from '@angular/core';
import { BergOutletModule } from '@berglund/mixins';
import { BergSelectModule } from '@berglund/material';
import { SelectMixinProgrammaticExampleComponent } from './select-mixin-programmatic.component';

@NgModule({
  declarations: [SelectMixinProgrammaticExampleComponent],
  exports: [SelectMixinProgrammaticExampleComponent],
  imports: [BergOutletModule, BergSelectModule],
})
export class SelectMixinProgrammaticExampleModule {}
```

As you can see, the API is

- \+ intent-focused
- \+ reusable, components are easily reused since they are described as objects
- \- stiff. You cannot even add a `(click)`-binding. Everything has to be described in the mixin-API

### So when is this useful?

Is a layer between apps and component libraries is a good idea for your code? It depends on the context. If you're working on a hobby-project, the constraints would probably be too frustrating. But if you're working in a company with multiple apps, then a layer using mixins would do a lot for productivity and unified UX. Not to mention that serializable components is a game changer for apps with forms that need customization.
