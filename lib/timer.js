'use strict'

var timer = {
  /**
   * obtain min
   * @param {Number} min
   * @param {Number} duration
   * @return {Number}
   */
  min: function (min, duration) {
    if (min > duration || min === undefined) {
      min = duration
    }
    return min
  },

  /**
   * obtain max
   * @param {Number} max
   * @param {Number} duration
   * @return {Number}
   */
  max: function (max, duration) {
    if (max < duration || max === undefined) {
      max = duration
    }
    return max
  },

  /**
   * update timer stats object
   * @param {Object} obj - `{ count: , total: , min: , max: }`
   * @param {Number|Array} duration - as Number or `process.hrtime` object
   * @return {Object} updated object
   */
  update: function (obj, duration) {
    if (Array.isArray(duration)) {
      // calc duration in nanoseconds
      duration = duration[0] * 1e9 + duration[1]
    }
    if (!obj.count) {
      obj.count = 0
      obj.total = 0
    }
    obj.count++
    obj.total += duration
    obj.min = timer.min(obj.min, duration)
    obj.max = timer.max(obj.max, duration)
    return obj
  }
}

module.exports = timer
