# @berglund/rx

`@berglund/rx` is a state architecture that divides state into two parts

- observables
- connected components

The goal is to maximize the power of `rxjs`, and to minimize other state patterns, such as reducer actions and reactive forms. It does this by setting up all observables in services and connecting stateful components to these streams.

## The architecture

In most Angular app architectures, information flow is partly declared inside components through APIs like `FormControl`, `NgRx.Action` and the odd stateful `@Input`. They're all great APIs, but they share a common problem - they don't always mix well with `rxjs`.

`rxjs` is a declarative paradigm. We're supposed to declare our streams, fire our event producers, kick back, and watch as the app start updating magically. But when we rely on things like `FormControl` and `NgRx.Action`, we're including imperative programming into the code base. We're forced to call `subscribe` on observables, how else are we going to call `formControl.setValue`? And in many cases, what could have been neat declarative state code becomes a mess of `Subject` and `subscribe` calls.

### Step 1 - setup observables

The first step in this architecture is to describe information flow using nothing but `Observable`. For a user on imdb.com, it might look something like this:

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

In step 1, the information flow does not describe user interaction. This is where the second step comes in. Revisit the observables above and wrap some of them with `userValue`. This will create a `Subject` and subscribe it to that observable. The observable has become _connectable_, in the sense that values can be pushed onto it.

```typescript
@Injectable({ providedIn: 'root' })
export class UserRx {
  userName$ = userValue<string>();

  user$ = this.userName$.pipe(
    switchMap(userName => this.userService.auth(userName))
  );

  favoriteMovie$ = this.user$.pipe(
    switchMap(user) => this.movieService.get(user.favoriteMovieId))
  );
}
```

### Step 3 - connect to the subject

At this point, the observable chain is ready to start firing. The `Subject` just needs values pushed onto it. The simplest way would be to call `next` on the `Subject`, but then we'd still use statements to update state. This library instead contain utilities to write fully declarative code.

To connect a `FormControl` to a `Subject`, call connect `connectFormValue`

```typescript
@Injectable({ providedIn: 'root' })
export class UserForm {
  userName = new FormControl();

  constructor(private userRx: UserRx) {
    connectFormValue(this.userRx.userName, this.userName);
  }
}
```
