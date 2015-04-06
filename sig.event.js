;(function(root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['sig-js'], factory)
  else if (typeof exports === 'object')
    module.exports = factory(require('sig-js'))
  else
    root.sig.event = factory(root.sig)
}(this, function(sig) {
  var types = {}
  var typePriority = [
    'dom',
    'jquery',
    'eventEmitter',
    'd3Selection',
    'd3Dispatcher'
  ]


  function event() {
    var s = sig()
    var args = [listener].concat(sig.slice(arguments))

    var type = apply(inferType, args)
    if (type === null) throw new Error("No listener type found")
    apply(type.on, args)

    s.teardown(function() {
      apply(type.off, args)
    })

    return s

    function listener(e) {
      s.put(e)
    }
  }


  function inferType() {
    var result = null
    var args = arguments

    typePriority.some(function(typeName) {
      var type = types[typeName]
      if (!apply(type.is, args)) return false
      result = type
      return true
    })

    return result
  }


  types.dom = {}


  types.dom.is = function(listener, obj, eventName) {
    return hasMeth(obj, 'addEventListener')
        && hasMeth(obj, 'removeEventListener')
  }


  types.dom.on = function(listener, obj, eventName) {
    obj.addEventListener(eventName, listener)
  }


  types.dom.off = function(listener, obj, eventName) {
    obj.removeEventListener(eventName, listener)
  }


  types.jquery = {}


  types.jquery.is = function(listener, obj) {
    return hasMeth(obj, 'on')
        && hasMeth(obj, 'off')
  }


  types.jquery.on = function(listener, obj, eventName) {
    obj.on(eventName, listener)
  }


  types.jquery.off = function(listener, obj, eventName) {
    obj.off(eventName, listener)
  }


  types.eventEmitter = {}


  types.eventEmitter.is = function(listener, obj) {
    return hasMeth(obj, 'on')
        && hasMeth(obj, 'removeListener')
  }


  types.eventEmitter.on = function(listener, obj, eventName, useCapture) {
    obj.on(eventName, listener, useCapture)
  }


  types.eventEmitter.off = function(listener, obj, eventName) {
    obj.removeListener(eventName, listener)
  }


  types.d3Dispatcher = {}


  types.d3Dispatcher.is = function(listener, obj, eventName) {
    return hasMeth(obj, 'on')
        && hasMeth(obj, eventName)
        && !hasMeth(obj, 'off')
  }


  types.d3Dispatcher.on = function(listener, obj, eventName) {
    obj.on(eventName, listener, listener)
  }


  types.d3Dispatcher.off = function(listener, obj, eventName) {
    obj.on(eventName, listener, null)
  }


  types.d3Selection = {}


  types.d3Selection.is = function(listener, obj) {
    return hasMeth(obj, 'selectAll')
        && hasMeth(obj, 'data')
        && hasMeth(obj, 'on')
  }


  types.d3Selection.on = function(listener, obj, eventName, useCapture) {
    obj.on(eventName, listener, useCapture)
  }


  types.d3Selection.off = function(listener, obj, eventName) {
    obj.on(eventName, null)
  }


  function hasMeth(obj, name) {
    return typeof (obj || 0)[name] == 'function'
  }


  function apply(fn, args) {
    return fn.apply(this, args)
  }


  return event
}));
