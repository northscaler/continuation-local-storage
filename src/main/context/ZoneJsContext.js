/* global Zone */
'use strict'

const DEFAULT_CONTEXT_NAME = '__ZONE_JS_CONTEXT'
const PROPERTIES = 'properties'

class ZoneJsContext {
  constructor (name) {
    this.name = (name || DEFAULT_CONTEXT_NAME).toString()
    this._context = this._getZoneWith(this.name)
  }

  _getZoneWith (name) {
    return Zone.current.getZoneWith(name) ||
      Zone.current.fork({
        name,
        properties: {
          [PROPERTIES]: {},
          [name]: DEFAULT_CONTEXT_NAME
        }
      })
  }

  set (name, value) {
    this._context.get(PROPERTIES)[(name || '').toString()] = value
  }

  get (name) {
    return this._context.get(PROPERTIES)[(name || '').toString()]
  }

  run (fn, values = {}) {
    return this._context.run(() => {
      Object.keys(values).forEach(key => this.set(key.toString(), values[key]))
      return fn()
    })
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => new ZoneJsContext(name)
