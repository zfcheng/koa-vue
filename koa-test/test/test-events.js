let tape = require('tape');
let events = require('../events.js')
tape('events test', function (t) {
    events.emit('event', 1)
})