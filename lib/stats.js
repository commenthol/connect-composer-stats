'use strict'

var timer = require('./timer')
var function2name = require('./function2name')

/**
 * create statistics for middleware(s)
 *
 * @return {Object}
 */
function stats () {
  var self = {
    data: {} // data to store stats
  }

  /**
   * take statistics from middleware function `fn`
   *
   * @param {Function} fn - middleware function from which to generate the statistics
   * @return {Function} wrapped middleware function
   */
  self.from = function (fn) { // eslint-disable-line
    var arity = fn.length
    var fnName = function2name(fn).string
    var wrap

    if (!self.data[fnName]) {
      self.data[fnName] = {
        name: fnName
      }
    }

    if (arity === 4) {
      wrap = function (err, req, res, next) {
        var start = process.hrtime()
        fn(err, req, res, function (err) {
          var duration = process.hrtime(start)
          self.data[fnName] = timer.update(self.data[fnName], duration)
          next && next(err)
        })
      }
      wrap.stats = fnName
      return wrap
    } else if (arity < 4) {
      wrap = function (req, res, next) {
        var start = process.hrtime()
        fn(req, res, function (err) {
          var duration = process.hrtime(start)
          self.data[fnName] = timer.update(self.data[fnName], duration)
          next && next(err)
        })
      }
      wrap.stats = fnName
      return wrap
    }
  },

  self.formatMs = function (number) {
    return (number / 1e6).toPrecision(3)
  }

  /**
   * Dump the collected statistics
   * @param {Object} [options] - options
   */
  self.dump = function (options) {
    for (var fn in self.data) {
      var entry = require('util')._extend(self.data[fn])
      entry.average = self.formatMs(entry.total / entry.count)
      entry.total = self.formatMs(entry.total)
      entry.min = self.formatMs(entry.min)
      entry.max = self.formatMs(entry.max)
      console.log(entry)
    }
  }

  return self
}

module.exports = stats
