'use strict'

const AbstractContext = require('./AbstractContext')
const DEFAULT_CONTEXT_NAME = '__CLS_HOOKED_CONTEXT'
let cls
const getClsHooked = () => cls || (cls = require('cls-hooked'))

/**
 * Context class based on [cls-hooked](https://www.npmjs.com/package/cls-hooked).
 */
class ClsHookedContext extends AbstractContext {
  constructor (name) {
    super((name || DEFAULT_CONTEXT_NAME).toString())
    this._context = getClsHooked().getNamespace(this.name) || getClsHooked().createNamespace(this.name)
  }

  /**
   * @override
   * @inheritDoc
   */
  dispose () {
    getClsHooked().destroyNamespace(this.name)
  }

  /**
   * @override
   * @inheritDoc
   */
  set (name, value) {
    this._context.set((name || '').toString(), value)
  }

  /**
   * @override
   * @inheritDoc
   */
  get (name) {
    return this._context.get((name || '').toString())
  }

  /**
   * @override
   * @inheritDoc
   */
  run (fn, values = {}, opts = { autodispose: false }) {
    return this._context.runAndReturn(() => {
      Object.keys(values).forEach(key => this.set(key.toString(), values[key]))
      return this._tryRun(fn, opts)
    })
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => new ClsHookedContext(name)
