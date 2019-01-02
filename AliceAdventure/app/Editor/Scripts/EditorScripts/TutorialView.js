const {
  IPC,
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const File = require('./File');
const View = require('./View');

class TutorialView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('TutorialView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementId) {
    const view = new TutorialView(elementId);
    view.InitView();
    return view;
  }

  InitView() {
    // eslint-disable-next-line no-undef
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        sceneList: null,
        objectList: null,
        projectName: null,
      },
      methods: {
        addScene: () => {
          TutorialView.AddScene('new scene');
        },
        addSceneWithBG: () => {
          TutorialView.AddScene('new scene', true);
        },
        addObject: () => {
          TutorialView.AddEmptyObject('new object');
        },
        addCharacter: () => {
          TutorialView.AddEmptyObject('new object', true);
        },
        deleteObject: (object) => {
          TutorialView.DeleteObject(object);
        },
        deleteScene: (scene) => {
          TutorialView.DeleteScene(scene);
        },
        selectSceneBG: (scene) => {
          View.Selection.selectObject(scene.GetFirstObject());
        },
        selectObjectPic: (obj) => {
          View.Selection.selectObject(obj);
        },
        // changeName: (event, thing) => {
        //   if (thing.name != null) thing.name = event.target.innerHTML;
        // },
        changeScene: (obj, toScene) => {
          obj.SwitchScene(toScene);
        },
        back: () => {},
        next: () => {
          Event.Broadcast('reload-project');
        },
        skip: () => {
          File.SaveProject((path) => {
            IPC.send('complete-tut', path);
          });
        },
        finish: () => {
          File.SaveProject((path) => {
            IPC.send('complete-tut', path);
          });
        },
        exit: () => {
          IPC.send('exit');
        },
      },
    });

    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
    Event.AddListener('delete-scene', (id) => {
      this.HandleDeleteScene(id);
    });
  }

  ReloadView() {
    if (GameProperties.instance == null) { // no proj loaded
      this.vModel.sceneList = null;
      this.vModel.objectList = null;
      this.vModel.projectName = null;
    } else { // proj loaded
      this.vModel.sceneList = GameProperties.instance.sceneList;
      this.vModel.objectList = GameProperties.instance.objectList;
      this.vModel.projectName = GameProperties.instance.settings.projectName;
    }
  }

  static AddEmptyObject(name, isCharacter = false) {
    const obj = SceneObject.AddEmptyObject(name, null);
    obj.isCharacter = isCharacter;
  }

  static AddScene(name, withBG = false) {
    const scene = Scene.AddScene(name);
    if (withBG) {
      const bg = SceneObject.AddEmptyObject('backdrop', scene, false);
      bg.isBackdrop = true;
      scene.bgSrc = bg.src;
    }
  }

  static DeleteObject(obj) {
    obj.DeleteThis();
  }

  static DeleteScene(scene) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.')) {
      scene.DeleteThis();
    }
  }

  static HandleDeleteScene(id) {
    if (GameProperties.instance.settings.startScene === id) {
      GameProperties.instance.settings.startScene = GameProperties.instance.sceneList[0].id;
    }
  }
}

module.exports = TutorialView;
