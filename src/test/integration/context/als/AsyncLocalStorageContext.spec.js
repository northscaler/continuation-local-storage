/* global describe, it, before */
'use strict'

const { AsyncLocalStorage } = require('async_hooks')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid/v4')
const { AsyncLocalStorageContext: Context } = require('../../../../main')

const tests = require('../context-tests')

describe('AsyncLocalStorageTest', function () {
  before(function () {
    let [, major, minor] = process.version.match(/^v(\d+)\.(\d+)\.(\d+)/i)
    major = parseInt(major)
    minor = parseInt(minor)
    if (process.env.NORTHSCALER_CLS_TEST_SKIP_ALS || major < 12 || (major === 12 && minor < 17)) {
      this.skip() // because AsyncLocalStorage came in Node.js 12.17.0
    }
  })

  it('should work with sync fn returning a value', function () {
    tests.testSyncFnReturningValue(Context, uuid())
  })

  it('should work with awaiting sync fn returning a value', async function () {
    await tests.testAwaitingSyncFnReturningValue(Context, uuid())
  })

  it('should work with awaiting async fn returning a value', async function () {
    await tests.testAwaitingAsyncFnReturningValue(Context, uuid())
  })

  it('should work with setTimeout', function (done) {
    tests.testContextValueAvailableInSetTimeout(Context, uuid(), done, { autodispose: false })
  })

  it('should work with Promise.resolve', function (done) {
    tests.testContextValueAvailableInPromiseResolve(Context, uuid(), done, { autodispose: false })
  })

  it('should work with Promise.reject', function (done) {
    tests.testContextValueAvailableInPromiseReject(Context, uuid(), done, { autodispose: false })
  })

  it('should work with async/await', async function () {
    return tests.testContextValueAvailableInAsyncAwait(Context, uuid())
  })

  it('should give the same context when given the same name', async function () {
    const name = uuid()
    const context = Context(name)._context
    expect(Context(name)._context).to.equal(context)
  })

  it('should work with setTimeout without Context abstraction', function (done) {
    const value = uuid()
    const als = new AsyncLocalStorage()

    function x () { expect(als.getStore().value).to.equal(value) }

    als.run({ value }, () => {
      x()
      setTimeout(() => {
        try {
          x()
          done()
        } catch (e) {
          done(e)
        }
      }, 5)
    })
  })
})
