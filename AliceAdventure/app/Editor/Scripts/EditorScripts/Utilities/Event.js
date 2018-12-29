const Debug = require('./Debug');

const events = {};

class Event {
  static Broadcast(event, parameters) {
    if (events[event] === undefined) {
      // Debug.LogWarning("Event \"" + _event + "\" is not defined. ");
    } else {
      // TODO: Checkevents
      for (let attr in events[event]) {
        events[event][attr](parameters);
      }
    }
  }

  static AddListener(event, fn) {
    if (events[event] === undefined) {
      events[event] = [];
    }

    if (typeof fn === 'function') {
      events[event].push(fn);
    } else {
      Debug.LogError(`Parameter added to event "${event}" is not a function.`);
    }
  }
}

module.exports = Event;
