# State

`@berglund/rx` is an architecture that divides apps into two parts

- observables
- components

The library is more of an idea than an implementation.
If you look through the sources, you'll find very few lines of code.

## The architecture

Normally, information flow in an Angular app comes from a combination of

- `@Output` and `@Input`
- Forms
- Dependency injection
- State management, such as ngrx.

Through things like `formControl`-directives and ngrx actions, information flow is a part of component development.

This architecture aim to completely separate information flow from components. It does that in two steps.

### Step 1 - setup observables

The first step in the architecture is to build the app using nothing but `Observable`.

```typescript
@Injectable({ providedIn: 'root' })
export class UserObservables {
  userName$ = EMPTY;

  user$ = this.userName$.pipe(
    switchMap(userName => this.userService.auth(userName))
  );

  favoriteMovie$ = this.user$.pipe(
    switchMap(user) => this.movieService.get(user.favoriteMovieId))
  );
}
```

### Step 2 - connect using subjects

In step 1, the information flow is:

- A user types their user name and password
- An API is called to log the user in
- Using the user resulting object, an API is called to get their favorite movie.

But all observables are silent. There are no event producers, so nothing will happen.

This is where the second step comes in: revisit the observables and wrap them with a `Subject`.
Use a different type of `Subject` depending on the type of observables.

```typescript
import { userInput } from '@berglund/rx';

userName$ = userInput<string>(EMPTY, [
  Validators.minLength(3),
  Validators.required,
]);
```

The `userInput` function will wrap the `userName$` observable with a `ValidatedSubject`.
A `ValidatedSubject` is just a `ReplaySubject` with built-in Angular validators - if validation fails, nothing is emitted.

With a `Subject` wrapping the `Observable`, the `Observable` can receiver user inputs. Any component that implements the `CanConnect`-interface can connect to it:

```typescript
userName = component({
  component: BergInputComponent,
  inputs: {
    label: 'User name',
    connect: this.observables.userName$,
  },
});
```
