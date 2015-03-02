;(function(root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['sig-js'], factory)
  else if (typeof exports === 'object')
    module.exports = factory(require('sig-js'))
  else
    root.sig.event = factory(root.sig);
}(this, function(sig) {
  function event() {
  }

  return event
}));
