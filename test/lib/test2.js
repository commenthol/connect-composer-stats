'use strict'

/**
 * a blocking middleware
 */
function F (req, res, next) {
  var i = 1000000 + (1000000 * Math.random()) |0
  while (i-- > 0) {} // a large loop
  if (!req._fn) req._fn = []
  req._fn.push('test2')
  next && next()
}

module.exports = F
