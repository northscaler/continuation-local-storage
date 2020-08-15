/* global Zone */
'use strict'

const AbstractContext = require('../../../dist/main/context/AbstractContext')
const DEFAULT_CONTEXT_NAME = '__ZONE_JS_CONTEXT'
const PROPERTIES = 'properties'

class ZoneJsContext extends AbstractContext {
  constructor (name) {
    super((name || DEFAULT_CONTEXT_NAME).toString())
    this._context = this._getZoneWith(this.name)
  }

  dispose () { }

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

  run (fn, values = {}, opts = { autodispose: false }) {
    return this._context.run(() => {
      Object.keys(values).forEach(key => this.set(key.toString(), values[key]))
      return this._tryRun(fn, opts)
    })
  }
}

module.exports = (name = DEFAULT_CONTEXT_NAME) => new ZoneJsContext(name)
