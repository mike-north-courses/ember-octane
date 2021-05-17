# Deleting a chat message

There's already a delete `<button class="message__delete-button">` in the `<ChatMessage />` component -- we just need to hook it up to something that does the appropriate deleting.

Begin by defining a new action on your `<ChannelContainer />` component [`app/components/channel-container.js`](../app/components/channel-container.js) that:

- makes a `DELETE` HTTP request to `/api/messages/${message.id}`, with header `Content-Type: application/json`
- if the request can't be completed, or if it returns a non-successful status code, throw an error
- remove the appropriate message from the `this.messages` array
- trigger a tracked property update by performing a "no-op" assignment `this.messages = this.messages`

```js
  @action async deleteMessage(message) {
    const resp = await fetch(
      `/api/messages/${message.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) {
      throw new Error(
        'Problem deleting message: ' + (await resp.text())
      );
    }
    const idx = this.messages
      .map(m => m.id)
      .indexOf(message.id);
    this.messages.splice(idx, 1);
    this.messages = this.messages;
  }

```

Now we can go to this component's template, and yield this action [`app/templates/components/channel-container.hbs`](../app/templates/components/channel-container.hbs).

```diff
    messages=this.messages
    acts=(hash
      createMessage=this.createMessage
+     deleteMessage=this.deleteMessage
    )
  )}}
</main>

```

and in our "channel" top-level template, pass this `deleteMessage` action to each `<ChatMessage />`. We'll want to "bake in" the message to delete using the `{{fn}}` helper, so that within the component's `.hbs` file we have a bound zero-argument function that we need only invoke at the right time. Let's open that file and hook the action up to the existing button. Open up [`app/teams/team/channel.hbs`](../app/teams/team/channel.hbs) and ensure each `<ChatMessage />` is passed the action.

```diff
    {{#each ch.messages as |message|}}
-     <ChatMessage @message={{message}}/>
+     <ChatMessage @message={{message}} @onDelete={{fn ch.acts.deleteMessage message}}/>
    {{/each}}
```

Finally, let's go into the component, and hook the action up to the existing button. In [`app/templates/components/chat-message.hbs`](../app/templates/components/chat-message.hbs), make the following change:

```diff
- <button
+ <button {{on "click" @onDelete}}
  class="message__delete-button border-transparent hover:border-red-300 show-on-hover hover:bg-red-100 border-1 rounded mb-1 pl-3 pr-2 py-1"
```

You should now be able to hover over each message to see a "delete" button, and clicking on one of these should result in the `DELETE` api call being made, and the message being removed from the screen (and your `db.json` database).

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/20c4578f07ae35ac64b867dc0ad0ec00d53bf8a7)
