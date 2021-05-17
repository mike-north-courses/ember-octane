# Creating Templates and Routes

In this exercise, we will be creating templates(handlebars) and routes for the same.
Then, we will configure the router file for the newly created routes. The routes, as we saw in earlier exercises, provides the data that templates display. Finally, we will wrap up this exercise, by adding some tests.

Let's get started!

## Configure Router

The router file is where information about routes is stored. We are going to add two new child routes - `team` and `channel`. The `channel` route will be a child of `team` route, which in turn will be a child of `teams` route. We are going to have route hierarchy that will be 3 levels deep.

Configure the routes by modifying the [`router`](../app/router.js) file as follows:

```diff
-   this.route('teams');
+   this.route('teams', function() {
+     this.route('team', {
+       path: ':teamId'
+     }, function() {
+       this.route('channel', {
+         path: ':channelId'
+       });
+     });
+   });
```

## Enhancing Routes

In this section, we will be creating/editing the following route files:

- [`../app/routes/teams.js`](../app/routes/teams.js)
- [`../app/routes/teams/team.js`](../app/routes/teams/team.js)
- [`../app/routes/teams/team/channel.js`](../app/routes/teams/team/channel.js)

In the [`teams`](../app/routes/teams.js) route, use the [`model`](https://api.emberjs.com/ember/3.9/classes/Route/methods/model?anchor=model) hook to return some hard coded static data, that can be displayed in the template. In this case, we will be returning an array of javascript objects. So, start with defining an array of objects.

Modify the [`teams`](../app/routes/teams.js) route as follows.

```diff
+   export const ALL_TEAMS = [
+     {
+       id: 'li',
+       name: 'LinkedIn',
+       order: 2,
+       iconUrl:
+         'https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&d=https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png',
+       channels: [
+         {
+           id: 'general',
+           name: 'general',
+           description: 'LinkedIn general (professional) chat',
+           teamId: 'li',
+         },
+         {
+           id: 'secrets',
+           name: 'secrets',
+           description: 'professional secrets',
+           teamId: 'li',
+         },
+       ],
+     },
+     {
+       id: 'ms',
+       name: 'Microsoft',
+       order: 3,
+       iconUrl:
+         'https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&d=https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png',
+       channels: [
+         {
+           id: 'general',
+           name: 'general',
+           description: 'Microsoft general chat',
+           teamId: 'ms',
+         },
+         {
+           id: 'ie8-gripes',
+           name: 'IE8 Gripes',
+           description:
+             'A place for whining about old browsers',
+           teamId: 'ms',
+         },
+       ],
+     },
+   ];
```

Then, return the hard coded static array defined above, from the `model` hook of the [`teams`](../app/routes/teams.js) route, by adding the following lines:

```diff
+   model() {
+     return ALL_TEAMS;
+   }
```

Now, lets move on to defining the [`team`](../app/routes/teams/team.js) route. Create a new `.js` file for `team` route at [`../app/routes/teams/team.js`](../app/routes/teams/team.js) and add the following to it.

```diff
+   import Route from '@ember/routing/route';
+   import { ALL_TEAMS } from '../teams';
+
+   export default class TeamsTeamRoute extends Route {
+     model({ teamId }) {
+       const matches = ALL_TEAMS.filter(
+         t => `${t.id}` === `${teamId}`
+       );
+       return matches[0];
+     }
+   }
```

In the code shown above, the `model` hook will return an object from the array of objects that we defined earlier in the [`teams`](../app/routes/teams.js) route. The object that will be returned will be the one whose `id` property matches the `teamId` specified in the url for this `team` route.

Similar to how we created the `team` route, create a new `.js` file for `channel` route at [`../app/routes/teams/team/channel.js`](../app/routes/teams/team/channel.js) and add the following code to it.

```diff
+   import Route from '@ember/routing/route';
+
+   export default class TeamsTeamChannelRoute extends Route {
+     model({ channelId }) {
+       const team = /** @type {{channels: {id: string}[]}} */ (this.modelFor(
+         'teams.team'
+       ));
+       const matches = team.channels.filter(
+         ch => `${ch.id}` === `${channelId}`
+       );
+       return matches[0];
+     }
+   }
```

In the code shown above, the `model` hook does something similar to what the `model` hook in the `team` route did; that is, it will return an object from the array of objects that we defined earlier in the [`teams`](../app/routes/teams.js) route. The object that will be returned will be the one whose `id` property matches the `channelId` specified in the url for this `channel` route.

## Displaying Static Data in templates

We have now configured routes to return hard coded static data from their respective `model` hooks. Now let's start creating the templates, so that we can display the data returned from the routes.

Generally, in an ember application, templates are associated with a route or a component. And this decides their exact location inside the `app/templates` directory.

For example, template files like [`team.hbs`](../app/templates/teams/team.hbs) which is present directly under the [`../app/templates`](../app/templates/) directory are templates associated with routes. And template files like [`team-sidebar.hbs`](../app/templates/components/team-sidebar.hbs) which is present under the [`../app/templates/components`](../app/templates/components) directory are templates associated with components.

In this section, we will be creating/editing the following template files:

- [`../app/templates/teams.hbs`](../app/templates/teams.hbs)
- [`../app/templates/components/team-selector.hbs`](../app/templates/components/team-selector.hbs)
- [`../app/templates/teams/team.hbs`](../app/templates/teams/team.hbs)
- [`../app/templates/components/team-sidebar.hbs`](../app/templates/components/team-sidebar.hbs)
- [`../app/templates/teams/team/channel.hbs`](../app/templates/teams/team/channel.hbs)

First, refactor the [`teams`](../app/templates/teams.hbs) template by replacing the existing content with the `TeamSelector` component, which gets passed the `teams` data, to be displayed in its own template.

```diff
-   <TeamSelector />
-   <TeamSidebar />
-   <main class="flex-1 flex flex-col bg-white overflow-hidden channel">
-     <ChannelHeader @title="compliments" @description="Say nice things about your teammates" />
-
-     <div class="py-4 flex-1 overflow-y-scroll channel-messages-list" role="list">
-       <ChatMessage />
-       <ChatMessage />
-       <ChatMessage />
-     </div>
-
-     <ChannelFooter />
-   </main>
-   {{outlet}}
+   <TeamSelector @teams={{this.model}} />
+   {{outlet}}
```

Inside the `team-selector` component's template defined at [`../app/templates/components/team-selector.hbs`](../app/templates/components/team-selector.hbs), replace the existing content with code to iterate over the `teams` array that got passed into it, from the calling location (i.e. the `teams` template).

The array iteration is done using handlebar's [`each`](https://api.emberjs.com/ember/3.9/classes/Ember.Templates.helpers/methods/each?anchor=each) helper. For a full list of built-in Helpers, see the [`Ember.Templates.helpers`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/) API documentation.

```diff
-   <nav
-     class="team-selector bg-blue-900 border-blue-900 border-r-2 pt-2 text-purple-lighter flex-none hidden sm:block"
-     aria-label="Team">
-     <a href="/li" data-team-id="li"
-       class="team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 block no-underline opacity-25 opacity-100">
-       <div
-         class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
-         <img class="team-selector__team-logo"
-           src="https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&amp;d=https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png"
-           alt="LinkedIn">
-       </div>
-     </a>
-     <a href="/ms" data-team-id="ms"
-       class="team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 block no-underline opacity-25">
-       <div class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
-         <img class="team-selector__team-logo"
-           src="https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&amp;d=https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png"
-           alt="Microsoft">
-       </div>
-     </a>
+<nav class="team-selector bg-blue-900 border-blue-900 border-r-2 pt-2 text-purple-lighter flex-none hidden sm:block"
+  aria-label="Team">
+  {{#each @teams as |team|}}
+    <LinkTo @route="teams.team" @model={{team.id}} data-team-id={{team.id}} class="team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 block no-underline opacity-25 opacity-100">
+      <div
+        class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
+        <img
+          class="team-selector__team-logo"
+          src={{team.iconUrl}}
+          alt={{team.name}}>
+      </div>
+    </LinkTo>
+  {{/each}}
```

Create a new template file(.hbs) corresponding to the child route `team` at `app/templates/teams/team.hbs`. And, in this `team` template, lets use the `team-sidebar` component(angle bracket component) that we already have, and pass the model data into it. Here the `this.model` is the data that was returned from the `model()` hook in the corresponding route, that is, the [`team.js`](../app/routes/teams/team.js) route.

(By default, `this.model` property is set automatically by [`setupController`](https://api.emberjs.com/ember/3.10/classes/Route/methods/setupController?anchor=setupController) - one of the other life cycle hooks available in the route)

```diff
+   <TeamSidebar @team={{this.model}}/>
+   {{outlet}}
```

Now change the implementation for `team-sidebar` component's template defined at [`../app/templates/components/team-sidebar.hbs`](../app/templates/components/team-sidebar.hbs) to dynamically display the team name.

Here `@team` refers to the attribute that was passed in to this team-sidebar component's template.

```diff
-   LinkedIn
+   {{@team.name}}
```

Iterate the `channels` array that was passed in as part of the @team attribute using the [`each`](https://api.emberjs.com/ember/3.9/classes/Ember.Templates.helpers/methods/each?anchor=each) helper.

```diff
-   <a href="/li/general" data-channel-id="general"
-     class="team-sidebar__channel-link py-1 px-4 text-white no-underline block bg-green-600">
-     <span aria-hidden="true">#</span>
-     general
-   </a>
+   {{#each @team.channels as |channel|}}
+     <LinkTo
+       @route="teams.team.channel"
+       @model={{channel.id}}
+       @activeClass="bg-green-600"
+       data-channel-id={{channel.id}}
+       class="team-sidebar__channel-link py-1 px-4 text-white no-underline block">
+       <span aria-hidden="true">#</span>
+       {{channel.name}}
+     </LinkTo>
+   {{/each}}
```

The final change needed in templates, for this exercise, is the `channel` template defined at [`../app/templates/teams/team/channel.hbs`](../app/templates/teams/team/channel.hbs).

Move the template code for displaying channel information, that was removed from the teams route's template and add it to the `channel`'s route template as follows:

```diff
+   <main class="flex-1 flex flex-col bg-white overflow-hidden channel">
+     <ChannelHeader @title={{this.model.name}} @description={{this.model.description}} />
+
+     <div class="py-4 flex-1 overflow-y-scroll channel-messages-list" role="list">
+       <ChatMessage />
+       <ChatMessage />
+       <ChatMessage />
+     </div>
+
+     <ChannelFooter />
+   </main>
```

## Add Tests

We are done with the implementations for this exercise, with regards to features. But we still need to add tests for testing our features.

In the `logout-test` defined at [`../tests/acceptance/logout-test.js`](../tests/acceptance/logout-test.js) lets modify the tests to reflect the new url associated with the `team` route, that has a [`dynamic segment`](https://guides.emberjs.com/release/routing/defining-your-routes/#toc_dynamic-segments) as part of its url.

```diff
-   await visit('/teams'); // Go to a URL
+   await visit('/teams/li'); // Go to a URL
```

```diff
-   assert.equal(currentURL(), '/teams'); // Make sure we've arrived
+   assert.equal(currentURL(), '/teams/li'); // Make sure we've arrived
```

The `team-sidebar` component is now used with an argument, `@team`. So modify the corresponding test defined at [`tests/integration/components/team-sidebar-test.js`](../tests/integration/components/team-sidebar-test.js).

```diff
-   await render(hbs`<TeamSidebar />`);
+   this.set('myTeam', {
+     name: 'LinkedIn',
+     channels: [
+       {
+         name: 'general',
+         id: 'general',
+       },
+     ],
+   });
+
+   await render(hbs`<TeamSidebar @team={{this.myTeam}}/>`);
```

Next, add test for the new route, `team`, which is a child route of the `teams` route.

For `team` (child) route, corresponding test file should be defined at [`tests/unit/routes/teams/team-test.js`](../tests/unit/routes/teams/team-test.js):

```diff
+   import { module, test } from 'qunit';
+   import { setupTest } from 'ember-qunit';
+
+   module('Unit | Route | teams/team', function(hooks) {
+     setupTest(hooks);
+
+     test('it exists', function(assert) {
+       let route = this.owner.lookup('route:teams/team');
+       assert.ok(route);
+     });
+   });
```

And finally, add a test for another new route that we added, `channel`, which is a child route of the `team` route.
For the `channel` (child) route, the corresponding test file should be defined at [`tests/unit/routes/teams/team/channel-test.js`](../tests/unit/routes/teams/team/channel-test.js):

```diff
+   import { module, test } from 'qunit';
+   import { setupTest } from 'ember-qunit';
+
+   module('Unit | Route | teams/team/channel', function(hooks) {
+     setupTest(hooks);
+
+     test('it exists', function(assert) {
+       let route = this.owner.lookup('route:teams/team/channel');
+       assert.ok(route);
+     });
+   });
```

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/610c5bfac850ecf0d87a0aa588fbaecaf15bd403)
