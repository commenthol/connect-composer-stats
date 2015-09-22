'use strict'

var timer = require('./timer')
// ~ var inspect = require('function-inspector').inspect

function Stats () {
  if (!(this instanceof Stats)) {
    return new Stats()
  }

  this.data = {} // data to store stats
}

module.exports = Stats

Stats.prototype = {
  /**
   *
   */
  from: function (fn) {
    var arity = fn.length
    var wrap
    var self = this

    if (!this.data[fn]) {
      this.data[fn] = {}
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
   *
   */
  dump: function () {

  }

}
