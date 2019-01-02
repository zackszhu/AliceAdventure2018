const {
  ID,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const IEvent = require('./IEvent');
const IReaction = require('./IReaction');

class Interaction {
  constructor(id, title = 'Title', event = null, conditionList = [], reactionList = [], max = true) {
    this.id = id === null ? ID.NewID : id;
    this.title = title !== null ? title : 'Title';
    this.event = event;
    this.conditionList = conditionList;
    this.reactionList = reactionList;

    this.max = max === null ? true : max;
  }

  static NewInteraction() {
    const interaction = new Interaction(null);
    GameProperties.AddInteraction(interaction);
    return interaction;
  }

  static LoadInteraction(data) {
    const event = IEvent.fromJsonObject(data.event);
    const reactionList = data.reactionList.map(reaction => IReaction.fromJsonObject(reaction));
    GameProperties.AddInteraction(
      new Interaction(data.id, data.title, event, data.conditionList, reactionList, data.max),
    );
  }

  SetIEvent(eventType) {
    this.event = new IEvent(eventType);
  }

  AddCondition(state) {
    this.conditionList.push({
      id: state.id,
      name: state.name,
      value: true,
    });
    // this.conditionList.push(_state);
    return true;
  }

  RemoveCondition(state) {
    // TODO: It was not pushing the state in, why it can be included?
    if (this.conditionList.includes(state)) {
      this.conditionList.splice(this.conditionList.indexOf(state), 1);
    }
  }

  AddIReaction(reactType, index) {
    // TODO: Keep API consistent, return index
    const reaction = new IReaction(reactType);
    if (index == null || index >= this.reactionList.length) { // push back
      this.reactionList.push(reaction);
    } else if (index <= 0) {
      this.reactionList.unshift(reaction); // push front
    } else { // insert
      this.reactionList.splice(index, 0, reaction);
    }
  }

  AddExistIReaction(reaction) {
    // Returns index
    this.reactionList.push(reaction);
    return this.reactionList.length - 1;
  }

  DeleteIReaction(reaction) {
    if (this.reactionList.includes(reaction)) {
      this.reactionList.splice(this.reactionList.indexOf(reaction), 1);
    }
  }

  DeleteThis() {
    GameProperties.DeleteInteraction(this);
  }

  toJsonObject() {
    const obj = {};
    obj.id = this.id;
    obj.title = this.title;
    obj.event = (this.event) ? this.event.toJsonObject() : null;
    obj.conditionList = this.conditionList;
    obj.reactionList = [];
    this.reactionList.forEach((react) => {
      obj.reactionList.push(react.toJsonObject());
    });
    obj.max = this.max;
    return obj;
  }

  static popElemToTopInList(index, list) {
    const selectElem = list[index];
    list.splice(index, 1);
    list.splice(0, 0, selectElem);
  }

  static moveElemAfterElemInList(indexA, indexB, list) {
    if (indexB === -1) {
      Interaction.popElemToTopInList(indexA, list);
      return;
    }

    if (indexA === indexB || indexA === indexB + 1) return;

    const movedElem = list[indexA];

    if (indexA < indexB) {
      list.splice(indexB + 1, 0, movedElem);
      list.splice(indexA, 1);
    } else {
      list.splice(indexA, 1);
      list.splice(indexB + 1, 0, movedElem);
    }
  }
}

module.exports = Interaction;
