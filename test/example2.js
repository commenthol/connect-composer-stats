'use strict'

var composestats = require('../')

// var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var stats = composestats()

// a middleware function
var mw = function (req, res, next) { next() }
// composing the single middlewares
var mws = compose(mw, mw, mw, mw)
// locally inject stats use:
mws.options = { stats: stats.from }

var req = {}; var res = {}

mws(req, res, function () {
  console.log(stats.data)
})

