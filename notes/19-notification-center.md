# Singleton-Driven UI - Notification Center

While components are generally reusable, sometimes it's more convenient to use _singleton state_ to drive a component, particularly in cases where many parts of a codebase need to be able to get involved with its behavior. A great example of this kind of pattern is a notification center.

<!-- Explain what singleton state is -->
<!-- Explain more about why a notification center is a good example of this involved behavior -->

## The Notification Component

Let's begin with a `<Notification />` component. Create the file [`app/templates/components/notification.hbs`](../app/templates/components/notification.hbs) as follows:

```hbs
<div class="notification flex flex-row items-center bg-{{@notification.color}} text-white text-sm font-bold px-4 py-3 notification-transition {{if @notification.entering "entering" ""}} {{if @notification.leaving "leaving" ""}}"
    role="alert">
  {{#if hasBlock}}
    {{yield }}
  {{else}}
    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
    </svg>
    <p>{{@notification.body}}</p>
  {{/if}}
</div>
```

This component uses a pattern where we can have a default DOM structure for notifications, in the event we use the "inline form" of the component

```hbs
<Notification @notification=... />
```

but can also customize it by using the "block form".

```hbs
<Notification @notification=... >
  Something custom
</Notification>
```

In the component's `.hbs` file above, you can see a condition based on the `hasBlock` property -- this is what allows us to conditionally render the SVG _only_ when inline form is used.

## The Service

Next, let's build a service to hold the collection of notifications

```sh
ember generate service notifications
```

and implement [`app/services/notifications.js`](../app/services/notifications.js) as follows:

```js
import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const getId = () => Math.round(Math.random() * 10000000);

const HANG_TIME = 3000; // ms

export default class NotificationsService extends Service {
  @tracked
  messages = [];

  @action
  notify(body, color = 'indigo-600') {
    const id = getId();
    const newNotification = {
      id,
      body,
      color,
    };
    // tracked property update via assignment
    this.messages = [...this.messages, newNotification];

    // REMOVE after elapsed time is complete
    setTimeout(() => {
      // remove notification by ID
      const idx = this.messages.map((n) => `${n.id}`).indexOf(`${id}`);
      this.messages.splice(idx, 1);

      // tracked property update via assignment
      this.messages = this.messages;
    }, HANG_TIME);
  }
}
```

Now, anywhere we need to be able to provide notifications, we need only inject this service and call `notifications.notify('Message');`:

## The List of Notifications

We'll need a component for the list of notifications. Let's use ember-cli to generate one

```sh
ember generate component notification-list
```

and implement its JS module [`app/components/notification-list.js`](../app/components/notification-list.js) as

```js
export default class NotificationListComponent extends Component {
  @service notifications;
}
```

and its HBS file [`app/templates/components/notification-list.hbs`](../app/templates/components/notification-list.hbs) as

```hbs
<div class="notifications-container z-10">
  {{#each this.notifications.messages as |msg|}}
    {{#if (eq msg.color "green-dark")}}
      <Notification @notification={{msg}}>
        <img src="https://media.giphy.com/media/toBi2rizjV8CswqIXG/giphy.gif" width="140" class="mr-20">
        {{msg.body}}
      </Notification>
    {{else}}
      <Notification @notification={{msg}} />
    {{/if}}
  {{/each}}
</div>
```

Let's use this component at the top of the channel, above all of the messages. Open [`app/templates/teams/team/channel.hbs`](../app/templates/teams/team/channel.hbs) and make the following change:

```diff
  <ChannelHeader @title={{this.model.name}} @description={{this.model.description}} />
+ <NotificationList />
  <div class="py-4 flex-1 overflow-y-scroll channel-messages-list" role="list">
    {{#each ch.messages as |message|}}
      <ChatMessage @message={{message}} @onDelete={{fn ch.acts.deleteMessage message}}/>
    {{/each}}
  </div>
```

## Notifying on Important Events

Now all we have left to do is use the service to create notifications in response to important events. Go ahead and inject our new `notifications` service onto the `<ChannelContainer />` component, and replace the exceptions on message creation and deletion with notifications. Additionally, create a notification upon successful completion of these operations.

```diff

  /**
   * @type {AuthService}
   */
  @service auth;

+ /**
+  * @type {NotificationsService}
+  */
+ @service notifications;

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
-     throw new Error(
-       'Problem deleting message: ' + (await resp.text())
-     );
+   if (resp.ok) {
+     const idx = this.messages
+       .map(m => m.id)
+       .indexOf(message.id);
+     this.messages.splice(idx, 1);
+     this.messages = this.messages;
+     this.notifications.notify('Deleted message');
+   } else {
+     this.notifications.notify('Problem deleting message', 'red');
    }
-   const idx = this.messages
-     .map(m => m.id)
-     .indexOf(message.id);
-   this.messages.splice(idx, 1);
-   this.messages = this.messages;
  }

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
-     throw new Error(
-       'Problem creating message: ' + (await resp.text()));
+     this.notifications.notify(
+       'Problem creating message: ' + (await resp.text()),
+       'red');

+   } else {
+     this.notifications.notify('Created new message', 'green-dark');
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

You should now see notifications upon creation and deletion of messages, both for successful completion of these operations and when the app encounters an error.

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/7670d6d56cc6d80d306a1761c3d50971598dd1f1)
