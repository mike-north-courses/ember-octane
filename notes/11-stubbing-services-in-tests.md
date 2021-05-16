# Stubbing Services in Tests

We have a problem: our tests only pass, when we're logged in with a particular userId -- because they're actually reading/writing to localStorage! This is a leak, and we need to fix it

Create a file in your tests folder like [`tests/test-helpers/auth-service.js`](../tests/test-helpers/auth-service.js), where we'll put our "stub" service that will be used in place of the real one during tests.

If you'd like to learn more about how to write tests using stubs, fakes and mocks, [this article is worth reading](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da).

```js
import Service, { inject as service } from '@ember/service';
import Router from '@ember/routing/router';
import { tracked } from '@glimmer/tracking';

export default class StubbedAuthService extends Service {
  /**
   * @type {Router}
   */
  @service router;
  /**
   * @type {string}
   */
  @tracked currentUserId = null;

  loginWithUserId(id) {
    this.currentUserId = id;
    this.router.transitionTo('teams');
  }
}
```

Now we just need to install it. Go to [`tests/integration/components/team-sidebar-test.js`](../tests/integration/components/team-sidebar-test.js) and begin by importing the stub service.

```js
import StubbedAuthService from 'shlack/tests/test-helpers/auth-service';
```

Now we just need to "register" the service before each test, ensuring our test-appropriate one is used in place of the real one. Put this code in the test module, but before any tests.

```js
hooks.beforeEach(function () {
  this.owner.register('service:auth', StubbedAuthService);
});
```

Finally, at the beginning of the test, set the state of the service according to our needs.

```js
this.owner.lookup('service:auth').currentUserId = 'LOL';
```

Make an appropriate adjustment to the assertion value, taking the userId into account and you should be good to go!

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/58aea7a707abf0b76097df846c2f0d25c45a3faa)
