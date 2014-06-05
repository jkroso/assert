
var assert = require('./');

[
  function() {
    var user = { name: 'Tobi' }
    assert(user.name == 'tobi')
  },
  function() {
    assert.equal(1, 2)
  },
  function() {
    assert.notEqual(1, 1)
  },
  function() {
    assert.throws(function() {
      throw new Error('boom')
    }, /Boom/)
  },
  function() {
    assert.throws(function() {
      1 + NaN
    })
  }
].forEach(function(fn) {
  try { fn() }
  catch (e) {
    return console.log(e.message)
  }
  throw new Error('you should not see this error')
})
