/**
 * Module dependencies.
 */

var stack = require('stack');

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

var getScript = typeof window == 'undefined'
  ? function(script){
    return require('fs').readFileSync(script, 'utf8');
  }
  : function(script){
    var xhr = new XMLHttpRequest;
    xhr.open('GET', script, false);
    xhr.send(null);
    return xhr.responseText;
  }

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

module.exports = function(expr, msg){
  if (expr) return;
  if (!msg) {
    if (Error.captureStackTrace) {
      var callsite = stack()[1];
      var file = callsite.getFileName();
      var line = callsite.getLineNumber() - 1;
      var col = callsite.getColumnNumber() - 1;
      var src = getScript(file).split('\n')[line];
      var m = src.slice(col).match(/assert\((.*)\)/);
      msg = m && m[1].trim() || src.trim();
    } else {
      msg = 'assertion failed';
    }
  }

  throw new Error(msg);
};
