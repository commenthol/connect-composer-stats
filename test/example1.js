'use strict'

var composestats = require('../')

// var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var stats = composestats()
// globally inject stats use:
compose.options = { stats: stats.from }

// a middleware function
var mw = function (req, res, next) { next() }
// composing the single middlewares
var mws = compose(mw, mw, mw, mw)
var req = {}; var res = {}

mws(req, res, function () {
  console.log(stats.data)
})

