'use strict'

/* globals describe, it */

var assert = require('assert')
var timer = require('../lib/timer')

describe('timer', function () {
  describe('min', function () {
    it('undefined', function () {
      var min
      var res = timer.min(min, 0)
      assert.strictEqual(res, 0)
    })

    it('defined higher', function () {
      var min = 4
      var res = timer.min(min, 3)
      assert.equal(res, 3)
    })

    it('defined lower', function () {
      var min = 2
      var res = timer.min(min, 3)
      assert.equal(res, 2)
    })
  })

  describe('max', function () {
    it('undefined', function () {
      var max
      var res = timer.max(max, 10)
      assert.strictEqual(res, 10)
    })

    it('defined higher', function () {
      var max = 4
      var res = timer.max(max, 3)
      assert.equal(res, 4)
    })

    it('defined lower', function () {
      var max = 2
      var res = timer.max(max, 3)
      assert.equal(res, 3)
    })
  })

  describe('update', function () {
    it('can update', function () {
      var obj = {}
      timer.update(obj, 5)
      assert.deepEqual(obj, { count: 1, total: 5, min: 5, max: 5 })
    })

    it('can update hrtimer array', function () {
      var obj = {}
      timer.update(obj, [ 5, 6955255 ])
      timer.update(obj, [ 1, 31185 ])
      assert.deepEqual(obj, { count: 2, total: 6006986440, min: 1000031185, max: 5006955255 })
    })

    it('can update multiple times', function () {
      var obj = {}
      for (var i = 1; i <= 5; i++) {
        timer.update(obj, i)
      }
      assert.deepEqual(obj, { count: 5, total: 15, min: 1, max: 5 })
    })
  })
})
