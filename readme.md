# sig.event

![Build Status](https://api.travis-ci.org/justinvdm/sig.event.png)

turn event listeners into [sig](https://github.com/justinvdm/sig) signals

```javascript
var EventEmitter = require('events').EventEmitter,
    event = require('sig-event')


var ee = new EventEmitter()

event(ee, 'foo')
  .map(function(v) { return v + 1 })
  .each(console.log)
  .done()

ee.emit(21)  // 22
  .emit(22)  // 23
  .emit(23)  // 24
```

supports:
  - [jquery selections](https://api.jquery.com/on/)
  - [d3 selections](https://github.com/mbostock/d3/wiki/Selections#on)
  - [d3 dispatchers](https://github.com/mbostock/d3/wiki/Internals#d3_dispatch)
  - [`EventEmitter`](https://nodejs.org/api/events.html#events_class_events_eventemitter)
  - [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)


## install

node:

```
$ npm install sig-event
```

browser:

```
$ bower install sig-event
```

## api

### `event([obj, event])`

Takes an object `obj` and an event name `event` and returns a signal that propagates each event with the name `event` emitted by `obj`. The signal will stop listening for events once it has ended.
