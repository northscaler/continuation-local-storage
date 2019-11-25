# `continuation-local-storage`
>NB: Git repo of truth is https://gitlab.com/northscaler-public/continuation-local-storage; all others are mirrors.

## Overview
This module provides a means to store information along the entirety of a single Node.js asynchronous call chain, or "continuation".
It is equivalent to a Vert.x [Context](https://vertx.io/docs/apidocs/index.html?io/vertx/core/Context.html), and similar to `ThreadLocal` from [Java](https://docs.oracle.com/en/java/javase/13/docs/api/java.base/java/lang/ThreadLocal.html), [.NET](https://docs.microsoft.com/en-us/dotnet/api/system.threading.threadlocal-1), and other, similar platforms.

Contexts allow you to place information in a continuation-local storage space so that it's available all the way up & down an asynchronous call stack so that you can set & get that information as necessary.

## Use
There two flavors to choose from: one based on [`cls-hooked`](https://www.npmjs.com/package/cls-hooked), and one based on [`zone.js`](https://www.npmjs.com/package/zone.js).
Use whichever one you want to; the `Context` API is the same:
* Run code in a context: `Context().run(() => { /* your code here */ }, { your: 'context', values: 'here')`
* Set a value in a context: `Context().set('name', 'value')`
* Get a value from a context: `Context().get('name')`

>IMPORTANT:
> In order to minimize transitive dependencies in your application, this module does _not_ require `cls-hooked` or `zone.js` itself.
> The consuming codebase must install the library (or libraries) that it needs.

If you are using `ZoneJsContext`, you must `npm install zone.js` yourself, then `require('zone.js/dist/zone-node')` at the right time for your application.
See `zone.js`'s documentation for more information.

If you are using `ClsHookedContext`, you must `npm install cls-hooked` yourself.

See this project's `package.json` `devDependencies` section for the versions of `cls-hooked` and `zone.js` was built against and try to install compatible ones.

## Example
```javascript
// prerequisite:  npm install --save cls-hooked

const Context = require('@northscaler/continuation-local-storage').ClsHookedContext // or ZoneJsContext

Context().run(() => { // uses the default context; pass a string name for a custom context
  // Do whatever you want here.
  // Context values are accessible anywhere in the sync or async call stack:
  const foo = Context().get('foo') // returns 'bar'
  
  // You can set & get values with:
  Context().set('baz', 'snafu')
  const baz = Context().get('baz') // returns 'snafu'
}, {
  foo: 'bar' // puts the value 'bar' into the context at key 'foo'
})
```
