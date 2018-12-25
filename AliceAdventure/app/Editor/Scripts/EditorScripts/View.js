const { Event } = require('./Utilities/Utilities');

class View {
  constructor(_tag = 'Untagged', _height = -1, _width = -1, _bindElementID = null) {
    this.tag = _tag;
    this.height = _height;
    this.width = _width;
    this.bindElementID = _bindElementID;
    this.dragData = {};
  }

  HandleDragstart(ev, infoType, data) {
    this.dragData = { type: infoType, data };
    // ev.dataTransfer.setData("text/plain", JSON.stringify({type: infoType, data: data}));
    // ev.dropEffect = 'all';
  }

  HandleDragover(ev, infoType, operation) {
    if (infoType == null || infoType === this.dragData.type) {
      ev.preventDefault();
      if (typeof operation === 'function') {
        operation(this.dragData.data);
      }
    }
  }

  HandleDragEnter(ev, infoType, operation) {
    if (infoType === this.dragData.type) {
      ev.preventDefault();
      if (typeof operation === 'function') {
        operation(this.dragData.data);
      }
    }
  }

  HandleDrop(ev, infoType, operation) {
    // var info = JSON.parse(ev.dataTransfer.getData("text"));
    if (infoType === this.dragData.type) {
      ev.preventDefault();
      if (typeof operation === 'function') {
        operation(this.dragData.data);
      }
      this.dragData = {};
    }
  }

  static get Selection() {
    return class Selection {
      constructor() {
        this.obj = null;
        this.scn = null;
        this.objOff = () => {
          if (this.obj != null) {
            this.obj.SelectOff();
            this.obj = null;
          }
        };
        this.scnOff = () => {
          if (this.scn != null) {
            this.scn.SelectOff();
            this.scn = null;
          }
        };
        this.objOn = (obj) => {
          this.objOff();
          if (obj != null) {
            this.obj = obj;
            obj.SelectOn();
          }
        };
        this.scnOn = (scn) => {
          this.scnOff();
          if (scn != null) {
            this.scn = scn;
            scn.SelectOn();
          }
        };
        Event.AddListener('delete-scene', (_id) => {
          if (this.scn && this.scn.id === _id) {
            this.objOff();
            this.scnOff();
            Event.Broadcast('update-selection');
          }
        });
        Event.AddListener('delete-object', (_id) => {
          if (this.obj && this.obj.id === _id) {
            this.objOff();
            Event.Broadcast('update-selection');
          }
        });
      }

      get object() {
        return this.obj;
      }

      get scene() {
        return this.scn;
      }

      deSelect() {
        this.objOff();
        this.scnOff();
        Event.Broadcast('update-selection');
      }

      deSelectObject() {
        this.objOff();
        Event.Broadcast('update-selection');
      }

      selectObject(obj) {
        this.objOn(obj);
        if (obj.bindScene != null) this.scnOn(obj.bindScene);
        Event.Broadcast('update-selection');
      }

      selectScene(scn) {
        this.scnOn(scn);
        this.objOff();
        Event.Broadcast('update-selection');
      }
    };
  }

  ReloadView() {
    // TODO
    return;
  }

  InitView() {
    // TODO
    return;
  }
}

View.DragInfo = {
  IEvent: 0,
  State: 1,
  ListedState: 2,
  IReaction: 3,
  ListedIReaction: 4,
  GalleryImage: 5,
  GallerySound: 6,
  ListedObject: 7,
  ListedScene: 8,
};

module.exports = View;
