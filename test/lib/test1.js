'use strict'

var compose = require('connect-composer')

module.exports = {
  /**
   * a non-blocking middleware
   */
  fix: function (req, res, next) {
    setTimeout(function () {
      next && next()
    }, 5)
  },

  rand: function (req, res, next) {
    var timeout = (10 + Math.random() * 5) | 0
    setTimeout(function () {
      next && next()
    }, timeout)
  },

  nTimes: function (times, fn) {
    var comp

    for (var i = 0; i < times; i++) {
      comp = comp(fn)
    }

    return comp
  },

  err: function (err, req, res, next) {
    res.error = err
    next && next()
  }
}
