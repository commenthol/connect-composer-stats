'use strict'

var composestats = require('../')

// var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var statsGlb = composestats()
var statsMw = composestats()
var statsFn = composestats()
// to globally inject stats use:
compose.options = { stats: statsGlb.from }

// a middleware function
var mw = function (req, res, next) { next() }
var mwF = function (req, res, next) { next() }
var mwG = function (req, res, next) { next() }

// wrap arround
var mwW = statsFn.from(mwF)

var mws = compose(mw, mw, mw, mw)
// inject stats only into composed middlewares
mws.options = { stats: statsMw.from }
var mwsG = compose(mwG, mwG, mwG, mw, mw)

var req = {}; var res = {}

mws(req, res, function () {
  console.log('local', statsMw.data)
  mwW(req, res, function () {
    console.log('fn', statsFn.data)
    console.log('global', statsGlb.data)  // is empty
    mwsG(req, res, function () {
      console.log('global', statsGlb.data)
    })
  })
})

