'use strict'

/* global describe, it */

var assert = require('assert')
var Stats = require('../lib/stats')
var test1 = require('./lib/test1')
var test2 = require('./lib/test2')

describe('stats', function () {
  it('can wrap a middleware with arity 3', function () {
    var stats = new Stats()
    debugger
    var mw = stats.from(test1.fix)


    console.log(mw)
    console.log(stats)
  })
})
