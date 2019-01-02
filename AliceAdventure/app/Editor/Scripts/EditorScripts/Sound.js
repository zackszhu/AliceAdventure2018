const {
  ID,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

class Sound {
  constructor(id, name, src) {
    this.id = id === null ? ID.NewID : id;
    this.name = name;
    this.src = src;
  }

  static NewSound(name = 'NewSound', src = '') {
    const sound = new Sound(null, name, src);
    GameProperties.AddSound(sound);
    return sound;
  }

  static LoadSound(data) {
    const sound = new Sound(data.id, data.name, data.src);
    GameProperties.AddSound(sound);
    return sound;
  }

  toJsonObject() {
    return {
      id: this.id,
      name: this.name,
      src: this.src,
    };
  }
}

module.exports = Sound;
