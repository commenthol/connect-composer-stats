# connect-composer-stats

> Statistics for connect-composer middlewares

[![NPM version](https://badge.fury.io/js/connect-composer-stats.svg)](https://www.npmjs.com/package/connect-composer-stats/)
[![Build Status](https://secure.travis-ci.org/commenthol/connect-composer-stats.svg?branch=master)](https://travis-ci.org/commenthol/connect-composer-stats)

Enable runtime measurements for composed middlewares using [connect-composer][] to track down latency problems within middlewares.

Inject either globally or locally into your composed middlewares and dump results into a CVS file.

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Description](#description)
  * [Set globally for all composed middlewares](#set-globally-for-all-composed-middlewares)
  * [Set locally for a single composed middlewares](#set-locally-for-a-single-composed-middlewares)
  * [Wrap arround a single middleware function](#wrap-arround-a-single-middleware-function)
* [Methods](#methods)
  * [stats()](#stats)
  * [from(fn)](#fromfn)
  * [dump(options)](#dumpoptions)
  * [data](#data)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Description

### Set globally for all composed middlewares

```js
var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var stats = composestats()
// globally inject stats use:
compose.options = { stats: stats.from }

// a middleware function
var mw = function (req, res, next) { next() }
// composing the single middlewares
var mws = compose (mw, mw, mw, mw)
var req = {}, res = {}

mws(req, res, function () {
  console.log(stats.data)
})
```

### Set locally for a single composed middlewares

```js
var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var stats = composestats()

// a middleware function
var mw = function (req, res, next) { next() }
// composing the single middlewares
var mws = compose (mw, mw, mw, mw)
// locally inject stats use:
mws.options = { stats: stats.from }

var req = {}, res = {}

mws(req, res, function () {
  console.log(stats.data)
})
```

### Wrap arround a single middleware function

```js
var composestats = require('connect-composer-stats')
var compose = require('connect-composer')
// get new stats object
var stats = composestats()

// a middleware function
var mw = function (req, res, next) { next() }
// wrapping the stats middleware
var wrap = stats.from(mw)

var req = {}, res = {}

wrap(req, res, function () {
  wrap(req, res, function () {
    console.log(stats.data)
  })
})
```

## Methods

### stats()

create statistics for middleware(s)

**Returns**: `Object`, object with functions


### from(fn)

take statistics from middleware function `fn`

**Parameters**

**fn**: `function`, middleware function from which to generate the statistics

**Returns**: `function`, wrapped middleware function


### dump(options)

Dump the collected statistics into a csv file or to stdout

**Parameters**

**options**: `Object`, options
  * ns: false,          // {Boolean} if `false` output is in milliseconds; if `true` then nanoseconds
  * dir: process.cwd(), // {String} dir where stats files are written; default current working dir
  * csv: true,          // {Boolean} of `true` output csv to filesystem; default `true`
  * sortkey: 'total'    // {String} key to reverse sort (total, average, max, min)

**Returns**: `String`, filename of csv file


### data

The data object where the statistics for each function are stored

**Example**

```js
{ './example.js:16:19:mwG':
   { name: './example.js:16:19:mwG', // file, line, column and name of function called
     count: 3,                       // number of function calls
     total: 6389,                    // time in nanoseconds
     min: 826,
     max: 2923 },
  './example.js:14:18:mw':
   { name: './example.js:14:18:mw',
     count: 2,
     total: 1662,
     min: 742,
     max: 920 } }
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

Copyright (c) 2015 commenthol (MIT License)

See [LICENSE][] for more info.

## References

<!-- !ref -->

* [connect-composer][connect-composer]
* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
[connect-composer]: https://github.com/commenthol/connect-composer



