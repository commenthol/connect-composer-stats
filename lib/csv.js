'use strict'

/**
 * helper functions for csv output
 */
var M = {
  /**
   * prepend leading zeros to `number`
   * @param {Number} number - number to append leading chars
   * @return {String}
   */
  format: function (number, str) {
    str = str || '00'
    number += ''
    return str.substring(number.length, str.length) + number
  },

  /**
   * output a csv line using `array`
   * @param {Array} array
   * @return {String} csv line
   */
  line: function (array) {
    var arr = array.map(function (i) {
      return (i + '').replace(/"/g, '\\"')
    })
    return '"' + arr.join('","') + '"\n'
  },

  /**
   * output a csv line using the `order` on `obj` properties
   * @param {Array} order - property names to output
   * @param {Object} obj - object with properties given in `order`
   * @return {String} csv line
   */
  byOrder: function (order, obj) {
    var out = []
    order.forEach(function (p) {
      out.push(obj[p] || '')
    })
    return M.line(out)
  }
}

module.exports = M
