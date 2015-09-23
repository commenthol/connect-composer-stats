'use strict'

var inspect = require('function-inspector').inspect

/**
 * resolve a function to its location and name
 * @param {Function} fn - function to resolve
 * @return {Object} - { string: "format" filename:line:column:name , file: filename, line: line of function, column: column of function }
 */
function function2name (fn) {
  var result = inspect(fn)
  var cwd = process.cwd()

  var file = (result.File || '').replace(/\.js$/, '')
  var lineColumn = result.LineNumber ? result.LineNumber + (result.ColumnNumber ? ':' + result.ColumnNumber : '') : ''
  var name = fn.name || result.Name || result.InferredName

  if (file.indexOf(cwd) === 0) {
    file = '.' + file.substring(cwd.length, file.length)
  }

  return {
    string: file + ':' + lineColumn + ':' + name,
    file: file,
    name: name,
    line: result.LineNumber,
    column: result.ColumnNumber
  }
}

module.exports = function2name
