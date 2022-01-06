# @berglund/rx

`@berglund/rx` is a state architecture that divides state into two parts

- observables
- operator components

The goal is to maximize the power of `rxjs`, and to minimize other state patterns, such as reducer actions and reactive forms. It does this by setting up all observables in services and viewing stateful components as operators in these streams.

## The architecture

In most Angular app architectures, information flow is partly declared inside components through APIs like `FormControl`, `NgRx.Action` and the odd stateful `@Input`. They're all great APIs, but they share a common problem - they don't always mix well with `rxjs`.

`rxjs` is a declarative paradigm. We're supposed to declare our streams, fire our event producers, kick back, and watch as the app start updating magically. But when we rely on things like `FormControl` and `NgRx.Action`, we're including imperative programming into the code base. We're forced to call `subscribe` on observables, how else are we going to call `formControl.setValue`? And in many cases, what could have been neat declarative state code becomes a mess of `Subject` and `subscribe` calls.

To get around this, and to truly maximize the power of `rxjs`, this architecture aims to completely remove stateful components. Instead, it treats those components as operator functions.

```typescript
// pseudo code
of(true).pipe(
  checkbox(),
  switchMap((preference) => this.preferences.update(preference))
);
```

### Step 1 - setup observables

The first step in the architecture is to describe information flow using nothing but `Observable`. For a user on imdb.com, it might look something like this:

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

### Step 2 - make observables connectable using subjects

In step 1, the information flow does not describe user interaction. This is where the second step comes in. Revisit the observables above and wrap some of them with `userInput`. This will create a `Subject` and subscribe it to that observable. The observable has become _connectable_, in the sense that values can be pushed onto it.

```typescript
import { userInput } from '@berglund/rx';

userName$ = userInput<string>(EMPTY, [
  Validators.minLength(3),
  Validators.required,
]);
```

### Step 3 - connect operator components

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

And that's it.
