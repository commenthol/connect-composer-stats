'use strict'

var timer = {
  min: function (min, duration) {
    if (min > duration || min === undefined) {
      min = duration
    }
    return min
  },

  max: function (max, duration) {
    if (max < duration || max === undefined) {
      max = duration
    }
    return max
  },

  update: function (obj, duration) {
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
