var http = require('http')
var inspect = require('function-inspector').inspect
console.log(inspect(http.createServer))

console.log(inspect(require('./test/test1')))
console.log(inspect(require('./test/test2')))
