const {
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

class PropertyView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('PropertyView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementId) {
    return new PropertyView(elementId);
  }

  InitView() {
    // eslint-disable-next-line no-undef
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        projectLoaded: false,
        showObject: false,
        object: null,
        showScene: false,
        scene: null,
      },
      methods: {
        toggleLock: () => {
          this.vModel.object.ToggleLock();
        },
        deleteObject: () => {
          this.DeleteObject();
        },
        deleteScene: () => {
          this.DeleteScene();
        },
        // addProperty: () => {
        //   this.bindObject.AddUserProperty(
        //     this.vModel.propertyKey,
        //     this.vModel.propertyType,
        //     this.vModel.propertyValue,
        //   );
        // }
      },
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
    Event.AddListener('update-selection', () => {
      this.UpdateSelection();
    });
  }

  ReloadView() {
    if (GameProperties.instance == null) {
      this.vModel.projectLoaded = false;
    } else {
      this.vModel.projectLoaded = true;
    }
  }

  UpdateSelection() {
    this.vModel.showObject = (View.Selection.object != null);
    this.vModel.object = View.Selection.object;

    this.vModel.showScene = (View.Selection.object == null) && (View.Selection.scene != null);
    this.vModel.scene = View.Selection.scene;
  }

  DeleteObject() {
    if (confirm('Are you sure you want to delete the object?')) {
      this.vModel.object.DeleteThis();
    }
  }

  DeleteScene() {
    if (confirm('Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.')) {
      this.vModel.scene.DeleteThis();
    }
  }
}

module.exports = PropertyView;
