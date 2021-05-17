# Presentational and Container Components

The pattern of container and presentational components was made popular by [this blog post by Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). In this step of the course, we'll explore this architectural pattern and its benefits, with a specific focus on how to apply it within an Ember Octane app.

<hr>
<p>
  <blockquote>
    <h3>
      💡 Mike's Tip: Don't aim for purity
    </h3>
    <a href="https://github.com/mike-north">
      <img src="https://github.com/mike-north.png" height=64 align="left" style="margin-right: 10px" />
    </a>
    <p>
      The "container and presentational components" pattern can result in significantly more testable, more easy to understand, and more composable code. Most of this is due to the benefits of separating state and state-manipulating logic from the component's other concerns (i.e., rendering HTML). Often the sweet spot for components will be "90% container" or "90% presentational", and aiming for 100% can result in significant additional unneeded complexity.
    </p>
  </blockquote>
</p>
<hr>

First, let's define two ideas that are central to this topic

- A _container component_, which owns state and may have some state-manipulating actions, doesn't do much in terms of rendering something to the screen. The primary purpose of one of these components is to "do things"
- A _presentational component_ owns no state, and has no state-manipulating actions (although it may be passed these things as arguments). The primary purpose of one of these components is to "display things"

In our app, we're going to use a container component to load channel messages, and in future exercises, create and delete messages.

Let's use ember-cli to create this new component.

```sh
ember generate component channel-container
```

This component will hold the `messages` state (and be responsible for managing it). Let's set ourselves up for this properly in [`app/components/channel-container.js`](../app/components/channel-container.js) with the following:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ChannelContainerComponent extends Component {
  @tracked
  messages = [];
}
```

Next, let's give ourselves a single DOM element "wrapper" around our container, and be sure to yield out the messages array so the "block" passed into our component can have access to them. In [`app/templates/components/channel-container.hbs`](../app/templates/components/channel-container.hbs), start with a template like:

```hbs
<main class="flex-1 flex flex-col bg-white overflow-hidden channel">

  {{! an object like  "foo.messages" }}
  {{yield (hash
    messages=this.messages
  )}}

</main>
```

Now let's use our component in [`app/templates/teams/team/channel.hbs`](../app/templates/teams/team/channel.hbs). Make the following change to replace the old `<main>` tag with this container component, and replace our hard-coded messages with a loop that creates a `<ChatMessage>` for every item in the `ch.messages` array.

```diff
- <main class="flex-1 flex flex-col bg-white overflow-hidden channel">
+ <ChannelContainer @channel={{this.model}} as |ch|>
  <ChannelHeader @title={{this.model.name}} @description={{this.model.description}} />

  <div class="py-4 flex-1 overflow-y-scroll channel-messages-list" role="list">
-    <ChatMessage />
-    <ChatMessage />
-    <ChatMessage />
+    {{#each ch.messages as |message|}}
+      <ChatMessage @message={{message}}/>
+    {{/each}}
  </div>

  <ChannelFooter />
- </main>
+ </ChannelContainer>
```

Next, we'll need to set things up so that messages load when the component renders, and whenever the channel changes. To accomplish this, we'll use "render modifiers", which are conceptually similar to a lifecycle hook, in that they let us trigger actions when a DOM element is inserted, or when a tracked property updates.

In [`app/templates/components/channel-container.hbs`](../app/templates/components/channel-container.hbs) we'll set up two modifiers: one for the initial render, and one for the `@channel` update

```diff
<main class="flex-1 flex flex-col bg-white overflow-hidden channel"
+  {{did-insert this.loadMessages}}
+  {{did-update this.loadMessages @channel}}
>
```

and define a corresponding action in [`app/components/channel-container.js`](../app/components/channel-container.js).

```diff
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
+ import { action } from '@ember/object';
+ import fetch from 'fetch';

export default class ChannelContainerComponent extends Component {
  @tracked
  messages = [];

+  @action
+  async loadMessages() {
+    const {
+      channel: { id: channelId, teamId },
+    } = this.args;
+
+    const messages = await (await fetch(
+      `/api/teams/${teamId}/channels/${channelId}/messages`
+    )).json();
+    if (this.isDestroyed || this.isDestroying) return;
+    this.messages = messages;
+  }
}

```

One piece of code that's worth pointing out is that last line in our new action: `this.messages = messages;`. This looks a little strange, but sheds light on the fact that _updates to tracked properties are triggered on assignment_. You can think of this like a `this.set('messages', this.get('messages'));` in the classic ember world, or `this.setState({ messages: this.messages });` in the react world.

Messages should now load with the app, but they're visually identical regardless of the data passed to them. This is because we haven't parameterized them yet. In [`app/templates/components/chat-message.hbs`](../app/templates/components/chat-message.hbs) we can fix this by using the `@message` param that's now passed to this component.

```diff
 <!-- Message -->
<div class="flex items-start px-6 py-2 text-sm hover-target hover:bg-gray-50 message" role="listitem">
  <figure class="w-10 h-10 rounded overflow-hidden mr-3">
-    <img class="message__user-avatar" src="https://gravatar.com/avatar/96c332a96737c6668906232e39cb16ef?s=200" alt="">
+    <img class="message__user-avatar" src={{@message.user.iconUrl}} alt="">
  </figure>

  <div class="flex-1">
    <h5 class="text-sm">
      <a href="#" class="message__user-name text-black font-bold no-underline hover:underline">
-       Lisa Huang-North
+       {{@message.user.name}}
      </a>
      <span class="sr-only">at</span>
      <time class="message__timestamp text-gray-500 text-xs font-normal">
-       {{format-timestamp '04-21-2019 12:21.38 PM'}}
+       {{format-timestamp @message.createdAt}}
      </time>
    </h5>

    <p class="message__body text-black leading-normal">
-     Would you like to join my professional network?
+     {{@message.body}}
    </p>
  </div>

```

Now you should see messages loading as the app renders, and changing as the user moves from channel to channel. All we need to do now is write a meaningful test.

There's some starter code for the mocked API responses in [`starter-files/016-pretender-server.js`](../starter-files/016-pretender-server.js). Copy the contents of this into [`tests/integration/components/channel-container-test.js`](../tests/integration/components/channel-container-test.js). Follow this with a reasonable test for asserting that the messages are actually yielded out from the `<ChannelContainer />`, and that each message has an id, body and user object. Here's an example implementation:

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Pretender, { ResponseHandler } from 'pretender';

/**
 *
 * @param {any} body
 * @returns {ResponseHandler}
 */
function jsonResponse(body) {
  return function () {
    return [200, {}, JSON.stringify(body)];
  };
}

/**
 * @this {Pretender}
 */
function setupServer() {
  this.get(
    '/api/teams/gh/channels/prs',
    jsonResponse({
      id: 'prs',
      teamId: 'gh',
      name: 'Pull Requests',
    })
  );
  this.get(
    '/api/teams/gh/channels/prs/messages',
    jsonResponse([
      {
        id: 1,
        user: {
          name: 'Testy Testerson',
        },
        body: 'Hello Tests',
      },
    ])
  );
}

module('Integration | Component | channel-container', function (hooks) {
  setupRenderingTest(hooks);

  /**
   * @type {Pretender | null}
   */
  let server;
  hooks.beforeEach(function () {
    server = new Pretender(setupServer);
  });
  hooks.afterEach(function () {
    server && server.shutdown();
    server = null;
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('myChannel', {
      id: 'prs',
      teamId: 'gh',
      name: 'Pull Requests',
    });

    await render(hbs`
      <ChannelContainer @channel={{this.myChannel}} as |ch|>
        <ul>
          {{#each ch.messages as |message|}}
            <li>({{message.id}}) {{message.user.name}} - {{message.body}}</li>
          {{/each}}
        </ul>
        template block text
      </ChannelContainer>
    `);

    assert.deepEqual(
      ('' + this.element.textContent)
        .trim()
        .replace(/\s*\n+\s*/g, '\n')
        .split('\n'),

      ['(1) Testy Testerson - Hello Tests', 'template block text']
    );
  });
});
```

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/cbf48e6fff59e0f76d9460c9793544b18cee2ef3)
