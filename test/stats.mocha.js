'use strict'

/* global describe, it */

var assert = require('assert')
var compose = require('connect-composer')
var stats_ = require('../lib/stats')
var test1 = require('./lib/test1')
var test2 = require('./lib/test2')
var function2name = require('../lib/function2name')

describe('stats', function () {
  it('can wrap and run a middleware with arity 3', function (done) {
    var stats = stats_()
    var req = {}
    var res = {}
    var mw = stats.from(test1.fix)

    assert.ok(mw.stats)
    assert.ok(!test1.fix.stats)

    mw(req, res, function () {
      assert.strictEqual(stats.data[function2name(test1.fix).string].count, 1)
      done()
    })
  })

  it('can wrap and run a middleware with arity 4', function (done) {
    var stats = stats_()
    var req = {}
    var res = {}
    var mw = stats.from(test1.err)

    assert.ok(mw.stats)
    assert.ok(!test1.fix.stats)

    mw('bad', req, res, function () {
      assert.deepEqual(res, { error: 'bad' })
      assert.strictEqual(stats.data[function2name(test1.err).string].count, 1)
      done()
    })
  })

  it('can wrap and run a composed middleware', function (done) {
    var stats = stats_()
    var req = {}
    var res = {}
    var fn = test1.nTimes(5, test1.fix)
    var mw = stats.from(fn)

    assert.ok(mw.stats)

    mw(req, res, function () {
      assert.strictEqual(stats.data[function2name(fn).string].count, 1)
      done()
    })
  })

  it('can add stats to a composed middleware', function (done) {
    var stats = stats_()
    var req = {}
    var res = {}
    var mw = compose(test1.nTimes(5, test1.fix))
    mw.options = { stats: stats.from }

    mw(req, res, function () {
      // ~ console.log(mw.stack)
      // ~ console.log(stats.data)
      assert.strictEqual(stats.data[function2name(test1.fix).string].count, 5)
      done()
    })
  })

  it('can run and dump stats of a composed middleware', function (done) {
    var stats = stats_()
    var req = {}
    var res = {}
    var mw = compose(test1.nTimes(5, test1.fix), test1.rand, test2)
    // ~ var mw = compose(test2)
    mw.options = { stats: stats.from }

    mw(req, res, function () {
      // ~ console.log(mw.stack)
      // ~ console.log(stats.data)
      // ~ assert.strictEqual(stats.data[test1.fix].count, 5)
      stats.dump()
      done()
    })
  })
})
