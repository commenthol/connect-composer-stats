'use strict'

var fs = require('fs')
var util = require('util')
var cluster = require('cluster')
var csv = require('./csv')
var timer = require('./timer')
var function2name = require('./function2name')

/**
 * create statistics for middleware(s)
 *
 * @example
 * var composestats = require('connect-composer-stats')
 * var compose = require('connect-composer')
 * // get new stats object
 * var stats = composestats()
 * // to globally inject stats use:
 * //compose.options = { stats: stats.from }
 *
 * // a middleware function
 * var mw = function (req, res, next) { next() }
 *
 * var mws = compose (mw, mw, mw, mw)
 * // inject stats only into composed middlewares
 * mws.options = { stats: stats.from }
 * var req = {}, res = {}
 *
 * mws(req, res, function () {
 *   console.log(stats.data)
 *   // { './example.js:8:18:mw':
 *   //  { name: './example.js:8:18:mw',
 *   //    count: 4,
 *   //    total: 149394,
 *   //    min: 876,
 *   //    max: 79260 } }
 * })
 * @return {Object} object with functions
 */
function stats () {
  var self = {}

  /**
   * collected statistics data
   */
  self.data = {}

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
   * Dump the collected statistics into a csv file or to stdout
   * @param {Object} [options] - options
   *     ns: false,          // {Boolean} if `false` output is in milliseconds; if `true` then nanoseconds
   *     dir: process.cwd(), // {String} dir where stats files are written; default current working dir
   *     csv: true,          // {Boolean} of `true` output csv to filesystem; default `true`
   *     sortkey: 'total'    // {String} key to reverse sort (total, average, max, min)
   * @return {String} filename of csv file
   */
  self.dump = function (options) {
    options = util._extend({
      ns: false,          // {Boolean} if `false` output is in milliseconds; if `true` then nanoseconds
      dir: process.cwd(), // {String} dir where stats files are written; default current working dir
      csv: true,          // {Boolean} of `true` output csv to filesystem; default `true`
      sortkey: 'total'    // {String} key to reverse sort (total, average, max, min)
    }, options)
    var entry
    var stream
    var now = new Date()
    var timestamp = +now
    var date = now.getFullYear() + '-' + csv.format(now.getMonth() + 1) + '-' + csv.format(now.getDate())
    var workerId = (cluster && cluster.worker) ? cluster.worker.id : 'x'
    var filename = options.dir + '/stats_' + date + '_' + timestamp + '_' + process.pid + '_' + workerId + '.csv'
    var order = 'name count total max average min'.split(' ')
    var sortBy = {}
    var sorter = function (a, b) {
      a = parseFloat(a, 10)
      b = parseFloat(b, 10)
      return a > b ? -1 : (a < b ? 1 : 0)
    }

    for (var fn in self.data) {
      entry = util._extend({}, self.data[fn])
      entry.average = options.ns ? (entry.total / entry.count | 0) : self.formatMs(entry.total / entry.count)
      entry.total = options.ns ? entry.total : self.formatMs(entry.total)
      entry.min = options.ns ? entry.min : self.formatMs(entry.min)
      entry.max = options.ns ? entry.max : self.formatMs(entry.max)
      sortBy[entry[options.sortkey]] = sortBy[entry.total] ? sortBy[entry.total].push(entry) : [ entry ]
    }

    if (options.csv) {
      stream = fs.createWriteStream(filename, { flags: 'w+', encoding: 'utf8' })
    } else {
      stream = process.stdout
    }
    if (stream) {
      stream.write(csv.line(order))
      Object.keys(sortBy).sort(sorter).forEach(function (key) {
        sortBy[key].forEach(function (entry) {
          stream.write(csv.byOrder(order, entry))
        })
      })
      if (stream !== process.stdout) {
        stream.end('')
      }
    }

    return filename
  }

  return self
}

module.exports = stats
