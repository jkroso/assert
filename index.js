
var src = require('function-source')
var equal = require('equals')
var stack = require('stack')
var match = require('match')
var json = JSON.stringify

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

function assert(expr, msg){
  if (!expr) throw new Error(msg || message())
}

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message() {
  if (!Error.captureStackTrace) return 'assertion failed'
  var callsite = stack()[2]
  var file = callsite.getFileName()
  var line = callsite.getLineNumber() - 1
  var col = callsite.getColumnNumber() - 1
  var src = getScript(file)
  line = src.split('\n')[line]
  var m = line.slice(col).match(/assert\((.*)\)/)
  return (m ? m[1] : line).trim()
}

/**
 * deep equality test
 *
 * @param {Any} a
 * @param {Any} b
 * @param {String} [msg]
 */

assert.equal = function(a, b, msg) {
  assert(equal(a, b), msg || message(1))
}

assert.notEqual = function(a, b, msg) {
  assert(!equal(a, b), msg || message(1))
}

/**
 * assert `value` matches `pattern`
 * @param {Any} a
 * @param {Any} pattern
 * @param {String} [msg]
 */

assert.match = function(a, pattern, msg) {
  assert(match(a, pattern), msg)
}

assert.notMatch = function(a, pattern, msg) {
  assert(!match(a, pattern), msg)
}

/**
 * assert that `fn` throws and error matching `msg`
 *
 * @param {Function} fn
 * @param {String|Function|RegExp} [msg]
 */

assert.throws = function(fn, msg) {
  try { fn() }
  catch (e) {
    if (!msg) return
    if (typeof msg == 'function') {
      assert(e instanceof msg, 'expected an ' + msg.name + ' to be thrown')
    } else {
      assert(match(e.message, msg), ''
        + 'error.message "' + e.message + '" does not match '
        + (msg instanceof RegExp ? msg.toString() : json(msg)))
    }
    return
  }
  throw new Error('expected an error in: ' + json(src(fn).trim()))
}

module.exports = assert
