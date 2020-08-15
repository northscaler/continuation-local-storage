# `continuation-local-storage`
>NB: Git repo of truth is https://gitlab.com/northscaler-public/continuation-local-storage; all others are mirrors.

## Overview
This module provides a means to store information along the entirety of a single Node.js asynchronous call chain, or "continuation".
It is equivalent to a Vert.x [Context](https://vertx.io/docs/apidocs/index.html?io/vertx/core/Context.html), and similar to `ThreadLocal` from [Java](https://docs.oracle.com/en/java/javase/13/docs/api/java.base/java/lang/ThreadLocal.html), [.NET](https://docs.microsoft.com/en-us/dotnet/api/system.threading.threadlocal-1), and other, similar platforms.

Contexts allow you to place information in a continuation-local storage space so that it's available all the way up & down an asynchronous call stack so that you can set & get that information as necessary.

## Use
There three flavors to choose from, based on either
* [`cls-hooked`](https://www.npmjs.com/package/cls-hooked),
* [`zone.js`](https://www.npmjs.com/package/zone.js), or
* [`AsyncLocalStorage`](https://nodejs.org/docs/latest-v12.x/api/async_hooks.html#async_hooks_class_asynclocalstorage) (requires Node.js >= 12.17.0).

Use whichever one you want to; the `Context` API is the same:
* Run code in a context: `Context().run(() => { /* your code here */ }, { your: 'context', values: 'here' })`
* Set a value in a context: `Context().set('name', 'value')`
* Get a value from a context: `Context().get('name')`

>IMPORTANT:
> In order to minimize transitive dependencies in your application, this module does _not_ require `cls-hooked` or `zone.js` itself.
> The consuming codebase must install the library (or libraries) that it needs.

### zone.js
If you are using `ZoneJsContext`:
 * You must `npm install zone.js` yourself.
 * You must `require('zone.js/dist/zone-node')` at the right time for your application.

See `zone.js`'s documentation for more information.

### cls-hooked
If you are using `ClsHookedContext`:
* You must `npm install cls-hooked` yourself.

### AsyncLocalStorage
If you are using `AsyncLocalStorage`:
* Your Node.js version must be `>=12.17.0`.
* If you're using `setTimeout`, `Promise.resolve` or `Promise.reject` within your `run` call, you must set the `autodispose` option to `false` in order to make the values available in those places.
See the tests in `src/test/unit/AsyncLocalStorageContext.spec.js`, in particular, `should work with setTimeout`, `should work with Promise.resolve` & `should work with Promise.reject`.
Track progress at https://gitlab.com/northscaler-public/continuation-local-storage/-/issues/2.

See this project's `package.json` `devDependencies` section for the versions of `cls-hooked` and `zone.js` was built against and try to install compatible ones.

## API
The basic API of these `Context`s is straightforward.
Once you get the `Context` (via `require` or `import`), these are the methods you'll use:

### Factory method
* `Context(key)`: Retrieves a context with the given key as a string (`Symbol`ic names are a [todo](https://gitlab.com/northscaler-public/continuation-local-storage/-/issues/3)).

### Instance methods
* `run(fn, values, opts)`: Runs a given function within the `Context`, making any `values`, an `Object`, available.  `opts` currently includes only `autodispose` and is `true` by default.
* `set(key, value)`: Sets the given `value` at the given `key`.
* `get(key)`: Gets the `value` at the given `key`.
* `dispose()`: It's not a bad idea to dispose of the `Context` when you know you're done with it, but it's not strictly required.
The `run` method defaults to automatic disposal, but if you observe memory leaks, this would be the first thing to check.

## Example
```javascript
// prerequisite:  npm install --save cls-hooked

const { ClsHookedContext: Context } = require('@northscaler/continuation-local-storage') // or ZoneJsContext, AsyncLocalStorageContext

Context().run(() => { // uses the default context; pass a string name for a custom context
  // Do whatever you want here.
  // Context values are accessible anywhere in the sync or async call stack:
  const foo = Context().get('foo') // returns 'bar'
  
  // You can set & get values with:
  Context().set('baz', 'snafu')
  const baz = Context().get('baz') // returns 'snafu'
}, { // these are your contextual values available in the async call stack
  foo: 'bar' // puts the value 'bar' into the context at key 'foo'
})
```
