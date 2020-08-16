/* global describe, it, before */
'use strict'

require('zone.js/dist/zone-node')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid/v4')
const { ZoneJsContext: Context } = require('../../../../main')

const tests = require('../context-tests')

describe('ZoneJsTest', function () {
  before(function () {
    if (process.env.NORTHSCALER_CLS_TEST_SKIP_ZONEJS) {
      this.skip()
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
    tests.testContextValueAvailableInSetTimeout(Context, uuid(), done)
  })

  it('should work with Promise.resolve', function (done) {
    tests.testContextValueAvailableInPromiseResolve(Context, uuid(), done)
  })

  it('should work with Promise.reject', function (done) {
    tests.testContextValueAvailableInPromiseReject(Context, uuid(), done)
  })

  it('should work with async/await', async function () {
    return tests.testContextValueAvailableInAsyncAwait(Context, uuid())
  })

  it('should give the same context when given the same name', async function () {
    const name = uuid()
    const context = Context(name)._context.name
    expect(Context(name)._context.name).to.equal(context)
  })
})
