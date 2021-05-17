# Creating new chat messages

In this step, we'll continue to explore the idea of container and presentational components by passing a `createMessage` action from the `<ChannelContainer />` into a presentational component. All the presentational component will do is invoke the action, without any concern for what the particulars of "saving a message" might entail.

Let's turn our attention to the [`app/components/channel-container.js`](../app/components/channel-container.js) file.

Let's begin by injecting the `auth` service, since we will need it in order to obtain the userId of the currently logged-in user.

```js
  /**
   * @type {AuthService}
   */
  @service auth;
```

Next, let's enhance our channel container by implementing a `createMessage` action. This should...

- take a chat message body (a string) as an argument
- make a `POST` API call with `Content-Type: application/json` header to the `/api/messages` endpoint, with a payload like `{ channelId: 'foo', teamId: 'bar', body: 'hello channel', userId: 123 }`
- throw an error if the HTTP response cannot be completed, or if the status code looks non-successful
- add the new message that the server returns to the `this.messages` array

```js

  @action
  async createMessage(body) {
    const {
      channel: { id: channelId, teamId },
    } = this.args;

    const resp = await fetch(`/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId,
        teamId,
        body,
        userId: this.auth.currentUserId,
      }),
    });
    if (this.isDestroyed || this.isDestroying) return;
    if (!resp.ok) {
      throw new Error(
        'Problem creating message: ' + (await resp.text())
      );
    }

    const newMessage = await resp.json();
    if (this.isDestroyed || this.isDestroying) return;

    this.messages = [
      ...this.messages,
      { ...newMessage, user: this.auth.currentUser },
    ];
    return newMessage;
  }
```

In this component's template, let's create a new `acts` object that's yielded out, and pass our new action along as a property. Consumers can then do something like `channel.acts.createMessage` to access this function. Make the following change to [`app/templates/components/channel-container.hbs`](../app/templates/components/channel-container.hbs).

```diff
<main class="flex-1 flex flex-col bg-white overflow-hidden channel"
  {{did-insert this.loadMessages}}
  {{did-update this.loadMessages @channel}}
>
  {{yield (hash
    messages=this.messages
+   acts=(hash
+     createMessage=this.createMessage
+   )
  )}}
</main>
```

Consume this new action that's yielded out of the component in [`app/templates/teams/team/channel.hbs`](../app/templates/teams/team/channel.hbs).

```diff
    {{/each}}
  </div>

-  <ChannelFooter />
+  <ChannelFooter @createMessage={{ch.acts.createMessage}} />
</ChannelContainer>
```

We now have a function available to `<ChannelFooter />`, either as `@createMessage` in the component's `.hbs` file or `this.args.createMessage` within the `.js` file which, when passed a string, creates a new chat message for the current user, in the current channel.

Before we use it, let's stop and think about some other reasonable behavior we might want in this component:

- The user should be able to "click" the "send" button to create the message, or `Cmd + Enter`
  - this is an indication that we probably want the "submitting" to happen via `<form>` and the `onsubmit` event.
- The "send" button should be disabled unless the user actually types something in the message field
  - this is an indication that we need to keep track of the `<input>`'s value at all times, and create some derived state (`isDisabled`) based on it

Let's take care of the "disable send, if the message is blank" functionality first. Create a new file [`app/components/channel-footer.js`](`../app/components/channel-footer.js`)
that contains:

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ChannelFooterComponent extends Component {
  @tracked messageBody; // the state of the `<input>` value

  @action updateMessageBody(evt) {
    // action fired on `<input>`'s "input" event
    this.messageBody = evt.target.value; // updating our state
  }
  // derived state: whether messageBody is empty or not
  get isDisabled() {
    return !this.messageBody;
  }
}
```

We'll need to hook this up with a few changes to our existing hbs file for this component [`app/templates/components/channel-footer.hbs`](`../app/templates/components/channel-footer.hbs`).

```diff
    <input id="message-input" class="channel-footer__message-input w-full px-4"
      placeholder="Message #general" type="text"
+     value={{this.messageBody}}
+     {{on "input" this.updateMessageBody}}
    >

-   <button disabled
-     class="channel-footer__message-send-button font-bold uppercase opacity-50 bg-gray-700 text-white border-green-600 p-2">
+   <button disabled={{this.isDisabled}}
+     class="channel-footer__message-send-button font-bold uppercase text-white border-green-600 p-2 {{if this.isDisabled "bg-gray-700 opacity-50" "bg-green-600"}}">
      SEND
    </button>
  </form>
```

Now let's hook up that submit event. Make one more change to [`app/templates/components/channel-footer.hbs`](`../app/templates/components/channel-footer.hbs`), to use the `{{on}}` modifier to fire an `this.onSubmit` action whenever the `<form>` fires its `"submit"` event.

```diff
<!-- Channel Footer -->
<footer class="pb-6 px-4 flex-none channel-footer">
- <form class="flex w-full rounded-lg border-2 border-gray-500 overflow-hidden" aria-labelledby="message-label">
+ <form class="flex w-full rounded-lg border-2 border-gray-500 overflow-hidden" aria-labelledby="message-label"
+   {{on "submit" this.onSubmit}} >
    <h1 id="message-label" class="sr-only">
      Message Input
    </h1>
```

Go back to [`app/components/channel-footer.js`](`../app/components/channel-footer.js`) and add the appropriate action.

```js
  @action
  async onSubmit(evt) {
    evt.preventDefault();
    await this.args.createMessage(this.messageBody); // call the fn we were passed as an arg
    if (!this.isDestroyed && !this.isDestroying) {
      this.messageBody = '';
    }
  }
```

You should now be able to create chat messages!

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/8d219e83a39ba848263b49370adcba64835e01fb)
