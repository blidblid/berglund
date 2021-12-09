# @berglund/rx

`@berglund/rx` is a state architecture that divides state into two parts

- observables
- operator components

The library is more of an idea than an implementation. If you look through the sources, you'll find very few lines of code.

## The architecture

Normally, information flow in an Angular app comes from a combination of

- `@Output` and `@Input`
- Forms
- State management, such as ngrx action dispatching.

and is a central part of component development. This architecture, however, aims to completely separate information flow from components. It does that in two steps.

### Step 1 - setup observables

The first step in the architecture is to describe information flow using nothing but `Observable`. For a user on imdb, it might look something like this:

```typescript
@Injectable({ providedIn: 'root' })
export class UserRx {
  userName$ = EMPTY;

  user$ = this.userName$.pipe(
    switchMap(userName => this.userService.auth(userName))
  );

  favoriteMovie$ = this.user$.pipe(
    switchMap(user) => this.movieService.get(user.favoriteMovieId))
  );
}
```

### Step 2 - make observable connectable using subjects

In step 1, the information flow missing a key part - at no point does it describe where a user interacts with it.

This is where the second step comes in: revisit the observables above and wrap some of them with `userInput`. This will create a `Subject` and subscribe it to that observable. The observable has become _connectable_ in the sense that we can push values onto it.

```typescript
import { userInput } from '@berglund/rx';

userName$ = userInput<string>(EMPTY, [
  Validators.minLength(3),
  Validators.required,
]);
```

### Step 3 - connect using operator components

At this point, the observable chain is ready to start firing. The `Subject` just needs values pushed onto it. This is the job of operator-components. An operator component implements the `CanConnect`-interface, which specifies how to interact with the `Subject`.

Using `@berglund/material/BergInputComponent`, connection looks like this

```typescript
userName = component({
  component: BergInputComponent,
  inputs: {
    label: 'User name',
    connect: this.observables.userName$,
  },
});
```

But other component libraries can connect too, with a `FormControl` for example:

```html
<input
  [formControl]="formControl"
  [connectFormControlValue]="rx.user.userName$"
/>
```
