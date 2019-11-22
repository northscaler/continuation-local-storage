'use strict'

const cls = require('cls-hooked')

const DEFAULT_CONTEXT_NAME = '__CLS_HOOKED_CONTEXT'

class ClsHookedContext {
  constructor (name) {
    this.name = (name || DEFAULT_CONTEXT_NAME).toString()
    this._context = cls.getNamespace(this.name) || cls.createNamespace(this.name)
  }

  set (name, value) {
    this._context.set((name || '').toString(), value)
  }

  get (name) {
    return this._context.get((name || '').toString())
  }

  run (fn, values = {}) {
    return this._context.runAndReturn(() => {
      Object.keys(values).forEach(key => this.set(key.toString(), values[key]))
      return fn()
    })
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => new ClsHookedContext(name)
