'use strict'

const AbstractContext = require('./AbstractContext')
const { AsyncLocalStorage } = require('async_hooks')

const DEFAULT_CONTEXT_NAME = '__ASYNC_LOCAL_STORAGE_CONTEXT'

const instances = new Map()

class AsyncLocalStorageContext extends AbstractContext {
  constructor (name) {
    super((name || DEFAULT_CONTEXT_NAME).toString())
  }

  dispose () {
    delete this._als
    instances.delete(this.name)
  }

  get _instance () {
    return this._als || (this._als = new AsyncLocalStorage())
  }

  get _store () {
    return this._instance.getStore()
  }

  set (name, value) {
    this._store.set((name || '').toString(), value)
  }

  get (name) {
    return this._store?.get((name || '').toString())
  }

  run (fn, values = {}, opts = { autodispose: true }) {
    return this._instance.run(this._mapOf(values), () => this._tryRun(fn, opts))
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => {
  return instances.get(name) || instances.set(name, new AsyncLocalStorageContext(name)).get(name)
}
