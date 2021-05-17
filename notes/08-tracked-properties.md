# Tracked Properties & Derived State

Ember Octane's `tracked` property system allows us to decorate our lowest-level mutable state, and then (for the most part) treat anything downstream as if it's regular modern JavaScript.

<!-- What does this mean in terms of this project? Why should a dev care? -->

Let's use tracked properties to enhance our `<LoginForm />` component in the following ways:

- We should have a class field `userId` that's kept in sync with the `<select>`'s value
  - The example validation message should be replaced with `"Logging in with userId {{this.userId}}"`, and should only be displayed if/when a valid `userId` is present
- We should have an `isDisabled` field that indicates whether the form has an invalid `userId` or not
  - The `input[type="submit"]` should be disabled whenever `isDisabled` is true
  - `onLoginFormSubmit` should only call `handleSignIn` if `isDisabled` is false
- Minimal updates to tests if any of them break (we'll do more meaningful testing next)

Let's get started!

Open up your component JS module [`app/components/login-form.js`](../app/components/login-form.js) and add the userId class field. For now, let's initialize it to `'1'`.

```js
/**
 * @type {string}
 */
userId = '1';
```

Also, let's add a very simple piece of derived state for `isDisabled`. Its value should be true if `userId` is falsy.

```ts
get isDisabled() {
  return !this.userId;
}
```

Update the validation message in the component's template [`app/templates/components/login-form.hbs`](../app/templates/components/login-form.hbs)

```diff
   <p class="text-blue text-xs italic my-4">
-    A validation message
+    Logging in with userId <code>{{this.userId}}</code>
   </p>
```

And hook up `isDisabled` to the `input[type="submit"]`.

```hbs
  <input disabled={{this.isDisabled}} type="submit">
```

We should also show some visual indication of whether this button is disabled. Replace the `"bg-grey"` class with a handlebars expression

```hbs
  <input
    class="{{if this.isDisabled "bg-grey" "bg-green-600"}} ...">
```

And also update the `<option>` tags so their `selected` attribute is true when the `userId` property matches the selected value.

```diff
-   <option value="">Select a user</option>
-   <option value="1">Testy Testerson</option>
-   <option value="2">Sample McData</option>
+   <option value="" selected={{not this.userId}}>Select a user</option>
+   <option value="1" selected={{eq this.userId "1"}}>Testy Testerson</option>
+   <option value="2" selected={{eq this.userId "2"}}>Sample McData</option>
```

We can now make two observations:

1. If we change the initializer of the `userId` class field in the component JS module, the appropriate user ends up being selected (and the validation text is also correctly initialized)
1. If we change the selected user, the validation text is not updated properly

What we're missing is a mechanism for receiving the `<select>`'s `"change"` DOM event, and updating `userId` appropriately.

In [`app/components/login-form.js`](../app/components/login-form.js), add an action

```ts
/**
 * Handle change events on the <select>
 * @param {Event & { target: HTMLSelectElement }} evt
 */
@action
onSelectChanged(evt) {
  this.userId = evt.target.value;
}
```

and in [`app/templates/components/login-form.hbs`](../app/templates/components/login-form.hbs), find the `<select>` and use the `{{on}}` modifier, so that whenever the `"change"` event is fired, the `this.onSelectChanged` action is invoked.

```hbs
<select {{on "change" this.onSelectChanged}} >
```

Now let's try changing the `<select>` again. You'll probably end up seeing an error message like this:

```
Assertion Failed: You must use set() to set the `userId` property (of [object Object]) to `2`.
    at assert (index.js:163)
    at LoginFormComponent.SETTER_FUNCTION [as userId] (metal.js:933)
    at LoginFormComponent.onSelectChanged (login-form.js:29)
```

What we're seeing is evidence that class fields work for the initial render without any special treatment, _until their value is mutated_. If we expect properties to be mutated, and those changes to cause re-renders we'll need to opt in to change tracking.

<!-- Say more about this. Why do we need to opt-in to change tracking? -->

First, import the `@tracked` decorator in [`app/components/login-form.js`](../app/components/login-form.js)

```js
import { tracked } from '@glimmer/tracking';
```

Then, decorate the `userId` class field

```ts
/**
 * @type {string}
 */
@tracked
userId = '1';
```

Now, try once more, and you should see that:

- Changes to the selected user should no longer throw errors
- The validation message should be kept in sync with the selected user

Let's make our initial state a little bit more reasonable. Let's start with no user selected -- all we have to do for this is initialize `userId` to null.

```ts
userId = null;
```

Let's also hide the validation text if `userId` is falsy.

```diff
  <p class="text-blue text-xs italic my-4">
+   {{#if this.userId}}
      Logging in with userId <code>{{this.userId}}</code>
+   {{/if}}
  </p>
```

Finally, let's go back to our JS module and make sure that if the form is disabled we don't call `this.handleSignIn`, and we use `userId` directly from the component class rather than querying the DOM to get the value.

```diff
   @action
   onLoginFormSubmit(evt) {
     evt.preventDefault();
-    const { target } = evt;
-    const { value } = target.querySelector('select');
-    if (value) this.handleSignIn(value);
+    if (!this.isDisabled) this.handleSignIn(this.userId);
   }
```

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/36cef7d1b40c652b601bdd1cbd15c27c6caaca85)
