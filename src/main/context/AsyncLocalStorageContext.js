'use strict'

const AbstractContext = require('./AbstractContext')
const { AsyncLocalStorage } = require('async_hooks')

const DEFAULT_CONTEXT_NAME = '__ASYNC_LOCAL_STORAGE_CONTEXT'

const instances = new Map()

/**
 * Context class based on [AsyncLocalStorage](https://nodejs.org/docs/latest-v12.x/api/async_hooks.html#async_hooks_class_asynclocalstorage).
 */
class AsyncLocalStorageContext extends AbstractContext {
  constructor (name) {
    super((name || DEFAULT_CONTEXT_NAME).toString())
    this._als = new AsyncLocalStorage()
  }

  /**
   * @override
   * @inheritDoc
   */
  dispose () {
    delete this._als
    instances.delete(this.name)
  }

  get _store () {
    return this._als.getStore()
  }

  /**
   * @override
   * @inheritDoc
   */
  set (name, value) {
    this._store.set((name || '').toString(), value)
  }

  /**
   * @override
   * @inheritDoc
   */
  get (name) {
    return this._store?.get((name || '').toString())
  }

  /**
   * @override
   * @inheritDoc
   */
  run (fn, values = {}, opts = { autodispose: false }) {
    return this._als.run(this._mapOf(values), () => this._tryRun(fn, opts))
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => {
  return instances.get(name) || instances.set(name, new AsyncLocalStorageContext(name)).get(name)
}
