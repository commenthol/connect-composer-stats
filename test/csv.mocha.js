'use strict'

/* globals describe, it */

var assert = require('assert')
var csv = require('../lib/csv')

describe('csv', function () {
  it('line', function () {
    var res = csv.line([ 'a', 1, true ])
    var exp = '"a","1","true"\n'
    assert.equal(res, exp)
  })

  it('byOrder', function () {
    var obj = {
      one: 1,
      two: 'two',
      three: true
    }
    var res = csv.byOrder(Object.keys(obj), obj)
    var exp = '"1","two","true"\n'
    assert.equal(res, exp)
  })
})
