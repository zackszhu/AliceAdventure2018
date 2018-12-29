const {
  ID,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

class State {
  constructor(id, name, val = false) {
    this.id = id === null ? ID.NewID : id;
    this.name = name;
    this.value = val;

    // GameProperties.AddState(this);
  }

  static NewState(name, val) {
    return new State(null, name, val);
  }

  static LoadState(data) {
    const state = new State(data.id, data.name, data.value);
    GameProperties.AddState(state);
    return state;
  }

  SetDefaultValue(val) {
    this.value = Boolean(val);
  }

  DeleteThis() {
    GameProperties.DeleteState(this);
  }

  toJsonObject() {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
    };
  }
}

module.exports = State;
