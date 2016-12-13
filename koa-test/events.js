
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', (xx) => {
  console.log(1)
});
myEmitter.on('event', (xx) => {
    console.log(2)
});

console.log('listenerCount: ', myEmitter.listenerCount('event'))
// myEmitter.emit('event');

module.exports = myEmitter;
