'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid/v4')

const value = uuid()

module.exports = {
  testSyncFnReturningValue: (Context, name) => {
    const rrv = uuid()

    expect(Context(name).run(() => {
      expect(Context(name).get('value')).to.equal(value)
      return rrv
    }, {
      value
    })).to.equal(rrv)
  },

  testAwaitingSyncFnReturningValue: async (Context, name) => {
    const rrv = uuid()

    expect(await Context(name).run(() => {
      expect(Context(name).get('value')).to.equal(value)
      return rrv
    }, {
      value
    })).to.equal(rrv)
  },

  testAwaitingAsyncFnReturningValue: async (Context, name) => {
    const rrv = uuid()

    expect(await Context(name).run(async () => {
      expect(Context(name).get('value')).to.equal(value)
      return Promise.resolve(rrv)
    }, {
      value
    })).to.equal(rrv)
  },

  testContextValueAvailableInSetTimeout: (Context, name, done, opts) => {
    function x () { expect(Context(name).get('value')).to.equal(value) }

    Context(name).run(() => {
      x()
      setTimeout(() => {
        try {
          x()
          done()
        } catch (e) {
          done(e)
        }
      }, 5)
    }, {
      value
    }, opts)
  },

  testContextValueAvailableInPromiseResolve: (Context, name, done, opts) => {
    Context(name).run(() => {
      Promise.resolve()
        .then(() => {
          expect(Context(name).get('value')).to.equal(value)
        })
        .then(() => done())
        .catch(e => done(e))
    }, {
      value
    }, opts)
  },

  testContextValueAvailableInPromiseReject: (Context, name, done, opts) => {
    Context(name).run(() => {
      Promise.reject(new Error('because'))
        .catch(() => {
          expect(Context(name).get('value')).to.equal(value)
        })
        .then(() => done())
        .catch(e => done(e))
    }, {
      value
    }, opts)
  },

  testContextValueAvailableInAsyncAwait: async (Context, name) => {
    Context(name).run(async () => {
      expect(Context(name).get('value')).to.equal(value)
      return Promise.resolve(1)
    }, {
      value
    })
  }
}
