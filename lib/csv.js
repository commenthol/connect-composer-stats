'use strict'

var M = {
  format: function (number, str) {
    str = str || '00'
    number += ''
    return str.substring(number.length, str.length) + number
  },

  line: function (array) {
    var arr = array.map(function (i) {
      return (i + '').replace(/"/g, '\\"')
    })
    return '"' + arr.join('","') + '"\n'
  },

  byOrder: function (order, obj) {
    var out = []
    order.forEach(function (p) {
      out.push(obj[p] || '')
    })
    return M.line(out)
  }
}

module.exports = M
