const {
  PROMPT,
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const State = require('./State');
const IEvent = require('./IEvent');
const IReaction = require('./IReaction');
const View = require('./View');

class ILibraryView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('ILibraryView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementID) {
    return new ILibraryView(elementID);
  }

  InitView() {
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        viewEnabled: false,
        events: IEvent.Library,
        states: null,
        reactions: IReaction.Library,
      },
      methods: {
        eventDragstart: (ev, d) => {
          super.HandleDragstart(ev, View.DragInfo.IEvent, d);
        },
        stateDragstart: (ev, d) => {
          super.HandleDragstart(ev, View.DragInfo.State, d);
        },
        reactionDragstart: (ev, d) => {
          super.HandleDragstart(ev, View.DragInfo.IReaction, d);
        },
        addCondition: (state, ntra) => {
          ntra.AddCondition(state);
        },
        newState: () => {
          ILibraryView.AddNewState();
        },
        deleteState: (state) => {
          state.DeleteThis();
        },
        addIReaction: (iReact, ntra, index) => {
          ntra.AddIReaction(iReact, index);
        },
      },
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  ReloadView() {
    if (GameProperties.ProjectedLoaded) {
      this.vModel.viewEnabled = true;
      this.vModel.states = GameProperties.instance.stateList;
    } else {
      this.vModel.viewEnabled = false;
      this.vModel.states = null;
    }
  }

  static AddNewState() {
    PROMPT({
      title: 'New state',
      label: 'State name: ',
      value: 'state_1',
    }).then((_name) => {
      if (_name != null) {
        // State.NewState(_name, false);
        GameProperties.instance.stateList.push(new State(null, _name, false));
      }
    });
  }
}

module.exports = ILibraryView;
