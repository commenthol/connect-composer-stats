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
  self.from = function (fn) {
    var arity = fn.length
    var wrap

    if (!self.data[fn]) {
      self.data[fn] = {}
    }

    if (arity === 4) {
      wrap = function (err, req, res, next) {
        var start = process.hrtime()
        fn(err, req, res, function (err) {
          var duration = process.hrtime(start)
          self.data[fn] = timer.update(self.data[fn], duration)
          next && next(err)
        })
      }
      wrap.stats = true
      return wrap
    } else if (arity < 4) {
      wrap = function (req, res, next) {
        var start = process.hrtime()
        fn(req, res, function (err) {
          var duration = process.hrtime(start)
          self.data[fn] = timer.update(self.data[fn], duration)
          next && next(err)
        })
      }
      wrap.stats = true
      return wrap
    }
  },

  /**
   * Dump the collected statistics
   * @param {Object} [options] - options
   */
  self.dump = function (options) {
    for (var fn in self.data){
      var entry = self.data[fn]
      // ~ entry.name = function2name(fn).string
      entry.average = entry.total / entry.count
      console.log(entry)
    }
  }

  return self
}

module.exports = stats
