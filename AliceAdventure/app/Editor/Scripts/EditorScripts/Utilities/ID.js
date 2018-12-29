let counter = 0;

class ID {
  static get NewID() {
    counter += 1;
    return counter;
  }

  static set Counter(newCounter) {
    counter = newCounter;
  }
}

module.exports = ID;
