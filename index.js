var stack = require('callsite')

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

var getScript = typeof window == 'undefined'
  ? function(script){
    return require('fs').readFileSync(script, 'utf8')
  }
  : function(script){
    var xhr = new XMLHttpRequest
    xhr.open('GET', script, false)
    xhr.send(null)
    return xhr.responseText
  }

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

function assert(expr, msg, depth){
  if (!expr) throw new Error(msg || message(depth || 0))
}

/**
 * Create a message from the call stack
 *
 * @return {String}
 * @api private
 */

function message(depth) {
  if (!Error.captureStackTrace) return 'assertion failed'
  var callsite = stack()[2 + depth]
  var file = callsite.getFileName()
  var line = callsite.getLineNumber() - 1
  var col = callsite.getColumnNumber() - 1
  var src = getScript(file)
  line = src.split('\n')[line]
  var m = line.slice(col).match(/assert\((.*)\)/)
  return (m ? m[1] : line).trim()
}

module.exports = assert
