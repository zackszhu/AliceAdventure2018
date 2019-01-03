const {
  PIXI,
  PROMPT,
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const View = require('./View');

class SceneView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('SceneView', height, width, bindElementID);
    this.app = null;
    this.vModel = null;
  }

  static NewView(elementID) {
    const view = new SceneView(elementID);
    return view;
  }

  InitView() {
    // eslint-disable-next-line no-undef
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        projectLoaded: false,
      },
      methods: {
        addScene: () => {
          this.AddScene();
        },
        assetDragover: (ev) => {
          super.HandleDragover(ev, View.DragInfo.GalleryImage);
        },
        assetDrop: (ev) => {
          super.HandleDrop(ev, View.DragInfo.GalleryImage, (data) => {
            this.AddObject(data);
          });
        },
        deleteSelected: () => {
          SceneView.DeleteSelected();
        },
      },
    });
    // Init app
    // TODO: Width and height magic number
    this.app = new PIXI.Application({
      width: 480,
      height: 360,
      antialiasing: true,
      backgroundcolor: 0xFFFFFF,
    });
    document.getElementById('canvas-container').appendChild(this.app.view);
    GameProperties.SetViewSize(480, 360);

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
    Event.AddListener('add-gallery-object', (_obj) => {
      this.AddObject(_obj);
    });
    Event.AddListener('object-sprite-click', (_obj) => {
      this.SelectObject(_obj);
    });
  }

  ReloadView() {
    this.app.stage.removeChildren();
    if (GameProperties.instance == null) {
      this.vModel.projectLoaded = false;
    } else {
      this.vModel.projectLoaded = true;
      GameProperties.instance.sceneList.forEach((scn) => {
        this.app.stage.addChild(scn.container);
        if (scn.selected) {
          View.Selection.selectScene(scn);
        }
      });
      GameProperties.instance.objectList.forEach((obj) => {
        if (obj.bindScene == null || obj.bindScene.id === 0) return;
        obj.bindScene.container.addChild(obj.sprite);
        if (obj.selected) {
          View.Selection.selectObject(obj);
        }
      });
    }
  }

  AddObject(objInfo) {
    if (View.Selection.scene == null) return;
    const bindScene = View.Selection.scene;
    const obj = SceneObject.AddObject(objInfo, bindScene,
      this.app.screen.width / 2, this.app.screen.height / 2);
    // _bindScene.container.addChild(_obj.sprite);
    // window.setTimeout(()=>{this.SelectObject(_obj);}, 10);
    SceneView.SelectObject(obj);
    // this.app.stage.addChild(_obj.sprite);
  }

  AddScene(name = null) {
    if (name === null) {
      PROMPT({
        title: 'New Scene',
        label: 'Input Scene Name: ',
        value: 'new-scene',
      }).then((sceneName) => {
        const scene = Scene.AddScene(sceneName);
        SceneView.SelectScene(scene);
        this.app.stage.addChild(scene.container);
      });
    } else {
      const scene = Scene.AddScene(name);
      SceneView.SelectScene(scene);
      this.app.stage.addChild(scene.container);
    }
  }

  static SelectObject(obj) {
    if (obj.selectAllowed) {
      View.Selection.selectObject(obj);
    }
  }

  static SelectScene(scn) {
    View.Selection.selectScene(scn);
  }

  static DeleteObject(obj) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete the object?')) {
      obj.DeleteThis();
    }
  }

  static DeleteScene(scn) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete the scene?\n\nDeleting the scene will also delete every object in it.')) {
      scn.DeleteThis();
    }
  }

  static DeleteSelected() {
    if (!GameProperties.ProjectLoaded()) return;
    if (View.Selection.object != null) {
      SceneView.DeleteObject(View.Selection.object);
    } else if (View.Selection.scene != null) {
      SceneView.DeleteScene(View.Selection.scene);
    }
  }
}

module.exports = SceneView;
