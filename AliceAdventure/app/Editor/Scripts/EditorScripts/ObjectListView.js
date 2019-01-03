const {
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

class ObjectListView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('ObjectListView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementId) {
    return new ObjectListView(elementId);
  }

  InitView() {
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        projectLoaded: false,
        sceneList: null,
        objectList: null,
        isDraggingObject: false,
        isDraggingScene: false,
        settings: null,
      },
      methods: {
        objectDragStart: (ev, d) => {
          View.HandleDragstart(ev, View.DragInfo.ListedObject, d);
        },
        objectDragover: (ev) => {
          View.HandleDragover(ev, View.DragInfo.ListedObject, () => {});
        },
        objectDrop: (ev, scene, object) => {
          View.HandleDrop(ev, View.DragInfo.ListedObject, (dragObj) => {
            dragObj.SwitchScene(scene, object);
            View.Selection.selectObject(dragObj);
          });
        },

        sceneDragStart: (ev, d) => {
          View.HandleDragstart(ev, View.DragInfo.ListedScene, d);
        },
        sceneDragover: (ev) => {
          View.HandleDragover(ev, View.DragInfo.ListedScene, () => {});
        },
        sceneDrop: (ev, aboveScene) => {
          View.HandleDrop(ev, View.DragInfo.ListedScene, (dragScene) => {
            if (aboveScene) {
              window.console.log('has above');
              GameProperties.moveSceneAfterScene(dragScene, aboveScene);
            } else {
              window.console.log('no above');
              GameProperties.popSceneToTop(dragScene);
            }
          });
        },
        onObjectSelect: (obj) => {
          View.Selection.selectObject(obj);
        },
        onSceneSelect: (scn) => {
          View.Selection.selectScene(scn);
        },
        deleteObject: (obj) => {
          this.DeleteObject(obj);
        },
        deleteScene: (scn) => {
          this.DeleteScene(scn);
        },
        deleteSelected: () => {
          this.DeleteSelected();
        },
      },
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  ReloadView() {
    if (GameProperties.instance == null) {
      this.vModel.projectLoaded = false;
      this.vModel.sceneList = null;
      this.vModel.objectList = null;
      this.vModel.settings = null;
    } else {
      this.vModel.projectLoaded = true;
      this.vModel.sceneList = GameProperties.instance.sceneList;
      this.vModel.objectList = GameProperties.instance.objectList;
      this.vModel.settings = GameProperties.instance.settings;
    }
  }

  static DeleteObject(obj) {
    if (confirm('Are you sure you want to delete the object?')) {
      obj.DeleteThis();
    }
  }

  static DeleteScene(scn) {
    if (confirm('Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.')) {
      scn.DeleteThis();
    }
  }

  static DeleteSelected() {
    if (!GameProperties.ProjectLoaded()) return;
    if (View.Selection.object != null) {
      ObjectListView.DeleteObject(View.Selection.object);
    } else if (View.Selection.scene != null) {
      ObjectListView.DeleteScene(View.Selection.scene);
    }
  }
}

// ObjectListView.prototype.updateOrder = function (dragedObj, toScene, aboveObj) {
//   if (!aboveObj) {
//     toScene.container.addChildAt(dragedObj.sprite, 0);
//   } else {
//     if (dragedObj.id == aboveObj.id) return;
//     let indexA = -1;
//     let indexB = -1;
//     for (let i = 0; i < toScene.container.children.length; i++) {
//       if (toScene.container.children[i].id == aboveObj.id) {
//         indexB = i;
//         continue;
//       }
//       if (toScene.container.children[i].id == dragedObj.id) {
//         indexA = i;
//         continue;
//       }

//       if (indexA != -1 && indexB != -1) {
//         break;
//       }
//     }

//     if (indexA == indexB + 1) {
//       return;
//     }

//     if (indexA == -1) {
//       toScene.container.addChildAt(dragedObj.sprite, indexB + 1);
//     } else if (indexA > indexB) {
//       let index = indexB + 1;
//       toScene.container.addChildAt(dragedObj.sprite, index);
//     } else {
//       toScene.container.addChildAt(dragedObj.sprite, indexB);
//     }
//   }

//   dragedObj.bindScene = toScene;
//   GameProperties.updateOrderByScene(toScene);
//   View.Selection.selectObject(dragedObj);
// };


module.exports = ObjectListView;
