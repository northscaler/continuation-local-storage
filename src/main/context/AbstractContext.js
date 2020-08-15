'use strict'

/**
 * Abstract base class for contexts.
 * Not intended for direct instantiaion.
 */
class AbstractContext {
  /**
   * @protected
   * @param {string} name The name of this context.
   */
  constructor (name) {
    this.name = name
  }

  /**
   * Disposes of this context's resources.
   * @abstract
   */
  dispose () {
    throw new Error('dispose() unimplemented')
  }

  /**
   * Sets the value on the context at the given key.
   * @abstract
   */
  set (name, value) {
    throw new Error('set() unimplemented')
  }

  /**
   * Gets the value from the context at the given key.
   * @abstract
   */
  get (name) {
    throw new Error('get() unimplemented')
  }

  /**
   * Runs the given function inside this context.
   * @abstract
   */
  run (fn, values = {}, opts = { autodispose: false }) {
    throw new Error('run() unimplemented')
  }

  /**
   * Converts a given object to a new `Map`.
   * @param values
   * @return {Map<any, any>}
   * @protected
   */
  _mapOf (values) {
    const map = new Map()
    Object.keys(values).forEach(key => map.set(key, values[key]))
    return map
  }

  /**
   * Runs the given function in a `try` block whose `finally` optionally calls `this.dispose` based on the given `opts`.
   * @param fn
   * @param opts
   * @return {*}
   * @protected
   */
  _tryRun (fn, opts) {
    try {
      return fn()
    } finally {
      if (opts?.autodispose) this.dispose()
    }
  }
}

module.exports = AbstractContext
