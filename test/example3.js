'use strict'

var composestats = require('../')

// var composestats = require('connect-composer-stats')
// get new stats object
var stats = composestats()

// a middleware function
var mw = function (req, res, next) { next() }
// wrapping the stats middleware
var wrap = stats.from(mw)

var req = {}; var res = {}

wrap(req, res, function () {
  wrap(req, res, function () {
    console.log(stats.data)
  })
})

