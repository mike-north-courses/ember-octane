# Templates

To describe the HTML portion of a web application, Ember uses declarative templates based on [Handlebars.js](https://handlebarsjs.com/) markup.

For now, we'll just focus on this file: `app/templates/application.hbs`. Markup you put in this template will be shown anytime your app is on the screen, regardless of URL (we'll get into URLs later).

## Moving the initial HTML & CSS into our app

The goal of this step is to place the starting point HTML and CSS in your new app, and see what it looks like in a browser.

For now, paste the following HTML in [`app/templates/application.hbs`](../app/templates/application.hbs)

<details>

<summary>Click to show <code>starter.html</code></summary>

```hbs {starter-file=starter.html}
<!-- Team Selector -->
<nav
  class="team-selector bg-blue-900 border-blue-900 border-r-2 pt-2 text-purple-lighter flex-none hidden sm:block">
  <a href="/li" data-team-id="li"
    class="team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 block no-underline opacity-25 opacity-100">
    <div
      class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
      <img class="team-selector__team-logo"
        src="https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&amp;d=https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png"
        alt="LinkedIn">
    </div>
  </a>
  <a href="/ms" data-team-id="ms"
    class="team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 block no-underline opacity-25">
    <div class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
      <img class="team-selector__team-logo"
        src="https://gravatar.com/avatar/0ca1be2eaded508606982feb9fea8a2b?s=200&amp;d=https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png"
        alt="Microsoft">
    </div>
  </a>
  <div class="team-selector__add-team-button cursor-pointer p-4">
    <div class="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
      <svg class="fill-current h-10 w-10 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z">
        </path>
      </svg>
    </div>
  </div>
</nav>

<!-- Team Sidebar -->
<section class="team-sidebar bg-blue-800 text-blue-100 flex-none w-64 pb-6 hidden sm:flex flex-col">
  <header class="team-sidebar__header text-white mb-2 mt-3 px-4 flex justify-between">
    <div class="flex-auto">
      <h1 class="team-sidebar__team-name font-semibold text-xl leading-tight mb-1 truncate">
        LinkedIn
      </h1>

      <div class="team-sidebar__current-user-indicator flex items-center mb-6">
        <svg class="h-2 w-2 fill-current text-green mr-2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10"></circle>
        </svg>
        <span class="team-sidebar__current-user-name text-white opacity-75 text-sm">
          Mike North
        </span>
      </div>
    </div>

    <div>
      <svg class="h-6 w-6 fill-current text-white opacity-25" viewBox="0 0 20 20">
        <path
          d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z"
          fill-rule="evenodd"></path>
      </svg>
    </div>
  </header>

  <nav class="mb-8 flex-1 team-sidebar__channels-list">
    <div class="px-4 mb-2 text-white flex justify-between items-center">
      <h2 class="opacity-75 text-lg">Channels</h2>

      <button class="team-sidebar__join-channel-button text-white" aria-label="Join channel" role="button">
        <svg class="fill-current h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z">
          </path>
        </svg>
      </button>
    </div>

    <a href="/li/general" data-channel-id="general"
      class="team-sidebar__channel-link py-1 px-4 text-white no-underline block bg-green-600">
      <span aria-hidden="true">#</span>
      general
    </a>
  </nav>

  <footer class="mx-4 mb-2 text-white">
    <button class="text-white rounded bg-gray-600 hover:bg-red-700 p-2 team-sidebar__logout-button">
      Logout
    </button>
  </footer>
</section>

<!-- Channel -->
<main class="flex-1 flex flex-col bg-white overflow-hidden channel">

  <!-- Channel Header -->
  <header class="border-b flex px-6 py-2 items-center flex-none channel-header">
    <div>
      <h3 class="text-gray-900 mb-1 font-extrabold channel-header__title">
        <span aria-hidden="true">#</span>
        general
      </h3>

      <h4 class="text-gray-700 text-sm truncate channel-header__description">
        Generally chatting about general things
      </h4>
    </div>

    <form
      class="ml-auto md:block border border-gray-500 rounded-lg pl-3 pr-2 py-1 flex flex-row-reverse items-center search-form">
      <label for="search" class="sr-only">Search messages</label>

      <input placeholder="Search" class="appearance-none search-form__field" id="search" type="search">

      <button aria-label="Submit search" class="search-form__button">
        <svg class="fill-current text-gray-500 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
          </path>
        </svg>
      </button>
    </form>
  </header>

  <!-- Channel Message List -->
  <div class="py-4 flex-1 overflow-y-scroll channel-messages-list" role="list">

    <!-- Message -->
    <div class="flex items-start px-6 py-2 text-sm hover-target hover:bg-gray-50 message" role="listitem">
      <figure class="w-10 h-10 rounded overflow-hidden mr-3">
        <img class="message__user-avatar" src="https://gravatar.com/avatar/96c332a96737c6668906232e39cb16ef?s=200" alt="">
      </figure>

      <div class="flex-1">
        <h5 class="text-sm">
          <a href="#" class="message__user-name text-black font-bold no-underline hover:underline">
            Lisa Huang-North
          </a>
          <span class="sr-only">at</span>
          <time class="message__timestamp text-gray-500 text-xs font-normal">
            Apr 21, 2019 12:21.38 PM
          </time>
        </h5>

        <p class="message__body text-black leading-normal">
          Would you like to join my professional network?
        </p>
      </div>

      <button
        class="message__delete-button border-transparent hover:border-red-300 show-on-hover hover:bg-red-100 border-1 rounded mb-1 pl-3 pr-2 py-1"
        aria-label="delete message">
        🗑
      </button>
    </div>

    <!-- Message -->
    <div class="flex items-start px-6 py-2 text-sm hover-target hover:bg-gray-50 message" role="listitem">
      <figure class="w-10 h-10 rounded overflow-hidden mr-3">
        <img class="message__user-avatar"
          src="https://en.gravatar.com/userimage/4584631/86f74019598950f6efd7b1b8e493259a.jpeg" alt="">
      </figure>

      <div class="flex-1">
        <h5 class="text-sm">
          <a href="#" class="message__user-name text-black font-bold no-underline hover:underline">
            Mike North
          </a>
          <span class="sr-only">at</span>
          <time class="message__timestamp text-gray-500 text-xs font-normal">
            Apr 21, 2019 12:23.4 PM
          </time>
        </h5>

        <p class="message__body text-black leading-normal">
          Hello developer, I looked at your profile and am impressed by your 14
          years of COBOL experience. Are you happy in your current role?
        </p>
      </div>

      <button
        class="message__delete-button border-transparent hover:border-red-300 show-on-hover hover:bg-red-100 border-1 rounded mb-1 pl-3 pr-2 py-1"
        aria-label="delete message">
        🗑
      </button>
    </div>

  </div>

  <!-- Channel Footer -->
  <footer class="pb-6 px-4 flex-none channel-footer">
    <form class="flex w-full rounded-lg border-2 border-gray-500 overflow-hidden" aria-labelledby="message-label">
      <h1 id="message-label" class="sr-only">
        Message Input
      </h1>

      <button class="text-3xl text-gray-500 border-r-2 border-gray-500 p-2" aria-label="File menu" type="button">
        <svg class="fill-current h-6 w-6 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z">
          </path>
        </svg>
      </button>

      <label for="message-input" class="sr-only">Message</label>

      <input id="message-input" class="channel-footer__message-input w-full px-4"
        placeholder="Message #general" type="text">

      <button disabled
        class="channel-footer__message-send-button font-bold uppercase opacity-50 bg-gray-700 text-white border-green-600 p-2">
        SEND
      </button>
    </form>
  </footer>
</main>
```

</details>

and the following in [`app/styles/app.css`](../app/styles/app.css)

<details>
<summary>Click to show <code>starter.css</code></summary>

```css {starter-file=starter.css}
@import 'tailwind.css';

.hover-target .show-on-hover {
  opacity: 0;
  filter: alpha(opacity=0);
}
.hover-target:hover .show-on-hover,
.hover-target .show-on-hover:focus,
.hover-target .show-on-hover:active {
  opacity: 1;
  filter: alpha(opacity=1);
}

.sr-only {
  clip-path: inset(50%);
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
```

</details>

If `ember serve` is running, you should be able to visit `http://localhost:4200` and see something on the screen like this

<p align='center'>

<img src="./img/app.png" width=800>

</p>

## Completed File

[view here](https://github.com/mike-north/ember-octane-workshop/commit/5ba89d25b4a638f17a06bd1d2eb5f0e1152e2903)
