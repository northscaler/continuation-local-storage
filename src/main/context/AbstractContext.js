'use strict'

class AbstractContext {
  constructor (name) {
    this.name = name
  }

  dispose () {
    throw new Error('dispose() unimplemented')
  }

  set (name, value) {
    throw new Error('set() unimplemented')
  }

  get (name) {
    throw new Error('get() unimplemented')
  }

  run (fn, values = {}, opts = { autodispose: true }) {
    throw new Error('run() unimplemented')
  }

  _mapOf (values) {
    const map = new Map()
    Object.keys(values).forEach(key => map.set(key, values[key]))
    return map
  }

  _tryRun (fn, opts) {
    try {
      return fn()
    } finally {
      if (opts?.autodispose) this.dispose()
    }
  }
}

module.exports = AbstractContext
