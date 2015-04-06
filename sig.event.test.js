global.document = require('jsdom').jsdom()
global.window = document.defaultView


var assert = require('assert'),
    $ = require('jquery'),
    d3 = require('d3'),
    EventEmitter = require('events').EventEmitter,
    event = require('./sig.event')


function capture(s) {
  var values = []

  s.each(function(x) { values.push(x) })
   .done()

  return values
}


function createEvent(name) {
  var e = document.createEvent('Event')
  e.initEvent(name, true, true)
  return e
}


describe("sig.event", function() {
  var el

  beforeEach(function() {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(function() {
    document.body.removeChild(el)
  })

  it("should support node.js event emitters", function() {
    var emitter = new EventEmitter()
    var s = event(emitter, 'foo')
    var results = capture(s)

    assert(!results.length)
    emitter.emit('foo', {a: 23})
    assert.deepEqual(results, [{a: 23}])

    emitter.emit('foo', {b: 21})
    assert.deepEqual(results, [{a: 23}, {b: 21}])

    s.end()
    emitter.emit('foo', {b: 20})
    assert.deepEqual(results, [{a: 23}, {b: 21}])
  })

  it("should support jquery selections", function() {
    var $el = $(el)
    var s = event($el, 'roar')
    var results = capture(s)

    var e1 = $.Event('roar')
    assert(!results.length)
    $el.trigger(e1)
    assert.deepEqual(results, [e1])

    var e2 = $.Event('roar')
    $el.trigger(e2)
    assert.deepEqual(results, [e1, e2])

    var e3 = $.Event('roar')
    s.end()
    $el.trigger(e3)
    assert.deepEqual(results, [e1, e2])
  })

  it("should support d3 selections", function() {
    var selection = d3.select(el)
    var s = event(selection, 'roar')
    var results = capture(s)

    assert(!results.length)
    selection.on('roar')({a: 23})
    assert.deepEqual(results, [{a: 23}])

    selection.on('roar')({b: 21})
    assert.deepEqual(results, [{a: 23}, {b: 21}])

    s.end()
    assert(typeof selection.on('roar') == 'undefined')
  })

  it("should support d3 dispatchers", function() {
    var dispatcher = d3.dispatch('roar')
    var s = event(dispatcher, 'roar')
    var results = capture(s)

    assert(!results.length)
    dispatcher.roar({a: 23})
    assert.deepEqual(results, [{a: 23}])

    dispatcher.roar({b: 21})
    assert.deepEqual(results, [{a: 23}, {b: 21}])

    s.end()
    assert.deepEqual(results, [{a: 23}, {b: 21}])
  })

  it("should support dom event listeners", function() {
    var s = event(el, 'roar')
    var results = capture(s)

    var e1 = createEvent('roar')
    assert(!results.length)
    el.dispatchEvent(e1)
    assert.deepEqual(results, [e1])

    var e2 = createEvent('roar')
    el.dispatchEvent(e2)
    assert.deepEqual(results, [e1, e2])

    var e3 = createEvent('roar')
    s.end()
    el.dispatchEvent(e3)
    assert.deepEqual(results, [e1, e2])
  })

  it("should throw an error if it can't find a listener type", function() {
    assert.throws(test, /No listener type found/)

    function test() {
      event({}, 'foo')
    }
  })
})
