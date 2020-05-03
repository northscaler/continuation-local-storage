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

  testContextValueAvailableInSetTimeout: (Context, name, done) => {
    Context(name).run(() => {
      setTimeout(() => {
        try {
          expect(Context(name).get('value')).to.equal(value)
          done()
        } catch (e) {
          done(e)
        }
      }, 5)
    }, {
      value
    })
  },

  testContextValueAvailableInPromiseResolve: (Context, name, done) => {
    Context(name).run(() => {
      Promise.resolve()
        .then(() => {
          expect(Context(name).get('value')).to.equal(value)
        })
        .then(() => done())
        .catch(e => done(e))
    }, {
      value
    })
  },

  testContextValueAvailableInPromiseReject: (Context, name, done) => {
    Context(name).run(() => {
      Promise.reject(new Error('because'))
        .catch(() => {
          expect(Context(name).get('value')).to.equal(value)
        })
        .then(() => done())
        .catch(e => done(e))
    }, {
      value
    })
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
