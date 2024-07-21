# Hot Reload

Utilities for hot reloading ([what is hot reloading?](#what-is-hot-reloading)) JavaScript modules and other assets on the web.

Used as part of my [build tool](https://github.com/tobloef/build-tool).

> [!WARNING]
> This project was created primarily for personal use. For this reason, it is not fully documented and I would not recommend using it. That said, I hope it can at least be inspirational for your own projects.

## Installation

```
npm install --save @tobloef/hot-reload
```

## Usage

### Hot reloading any asset

`HotReload` is a simple and agnostic building block for signaling that something should be hot reloaded.
The more advanced features of this package build upon this, but it can also be used for the scenarios that those features do not cover.

```js
import { HotReload } from "@tobloef/hot-reload";

const hot = new HotReload(import.meta.url);

// Listen for file changes
hot.onReload("/models/foo.obj", () => {
  // Do what needs to be done when the file changes
  // Likely involves re-fetching the assets and doing something with the new version
});

// Signal that a file changed
// Could for example be hooked up to a WebSocket listening to file events from the server
hot.reload("/models/foo.obj");
```

When a hot-reload was for some reason not possible (`reload(...)` returns `false`, you could for example fallback to a live reload instead.

### Manually hot reloading JavaScript modules

Similar to `HotReload` but built for loading JavaScript modules.

Loads the module automatically, but does _not_ replace any existing usages of the module.

```js
import { HotModuleReload } from "@tobloef/hot-reload";

const hmr = new HotModuleReload(import.meta.url);

// Listen for file changes
hmr.onReload("/scripts/foo.js", (newModule) => {
  newModule.someExportedFunction();
});

// Can also be used with import attributes
// https://github.com/tc39/proposal-import-attributes
hmr.onReload("/configs/foo.json", { type: "json" }, (newModule) => {
  console.log(newModule.someJsonProp);
});
```

### Automatically hot reloading JavaScript modules

This is the reason this package was made:
To hot reload JavaScript modules without any manual handling of reload events.

This is accomplished by injecting script files with the ability to hot reload their imports upon receiving a reload event.
This package cannot do this alone and will need an HTTP server or Service Worker to intercept and inject scripts.
You will also likely need a WebSocket server or similar to notify the page when a file has changed.

To make the script `foo.js` support hot-reloading for all its imports, you call `injectHotImports` like this:

```js
const originalScript = "...";
const modulePath = "./foo.js";
const newScript = await injectHotImports(originalScript, modulePath);
```

When injecting, an input script like this:

```js
import { foo } from "./bar.js";

document.querySelector("button").addEventListener("click", () => {
  foo();
});
```

Turns into an output script like this:

```js
////////// START OF INJECTED HOT-RELOAD CODE //////////

let foo;

await (async () => {
  const { HotModuleReload } = await import("@tobloef/hot-reload");

  const hmr = new HotModuleReload(import.meta.url);

  hmr.onReload("./bar.js", (newModule) => {
    foo = newModule["foo"];
    return true;
  });

  foo = (await hmr.getModule("./bar.js")["foo"];
})();

/////////// END OF INJECTED HOT-RELOAD CODE ///////////

document.querySelector("button").addEventListener("click", () => {
  foo();
});
```

#### Limitations

* Only works with [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
* Because the injection only makes a module's _imports_ hot reloadable,
  top-level scripts in your HTML file (imported using the `script` tag) will _not_ be hot reloadable.

## What is hot reloading?

The way I see it, "hot reloading" is taking a part of a running program and swapping it out for a new version without restarting the whole program.
For example, being able to update a JavaScript module without refreshing the whole page.

You can also have "live reloading", where you restart the whole program (or refresh the webpage) automatically when a change is detected.

Live reloading is a simpler strategy, easier to implement and with fewer things that can go wrong.
Hot reloading has the advantage of minimizing the amount of lost state to the specific part that was changed.
For example, when developing a video game, you might update a 3D model or a function to calculate health points, while still the player's position, score, etc.
