const {
  PIXI,
  ID,
  Event,
  Debug,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

class Scene {
  constructor(id, name = 'untitledScene') {
    this.id = id === null ? ID.NewID : id;
    this.name = name;

    this.container = null;
    this.selected = false;
    this.bgSrc = 'src/picture.png'; // TODO: Replace that
    this.objectList = [];

    GameProperties.AddScene(this);
  }

  static AddScene(name) {
    const scene = new Scene(null, name);
    scene.InitContainer();
    return scene;
  }

  static LoadScene(data) {
    const scene = new Scene(data.id, data.name);
    scene.InitContainer();
    return scene;
  }

  // Unused
  // static addObj(obj) {
  //   this.objectList.push(obj);
  // }

  // static removeObj(obj) {
  //   this.objectList.filter(elem => elem.id === obj.id);
  // }

  InitContainer() {
    this.container = new PIXI.Container();
    this.container.visible = false;
  }

  SetAsStartScene() {
    if (!GameProperties.ProjectedLoaded) return;
    GameProperties.instance.settings.startScene = this.id;
  }

  DeleteThis() {
    if (GameProperties.instance === null) return false;
    if (GameProperties.GetSceneLength() <= 1) {
      Debug.LogError('You have to keep at least one scene!');
      return false;
    }

    // Delete objects in scene
    const objToDelete = [];
    GameProperties.instance.objectList.forEach((obj) => {
      if (obj.bindScene === this) {
        objToDelete.push(obj);
      }
    });
    objToDelete.forEach((obj) => {
      obj.DeleteThis();
    });
    // Delete scene
    if (this.container != null) {
      if (this.container.parent != null) this.container.parent.removeChild(this.container);
      this.container.destroy();
    }
    GameProperties.DeleteScene(this);
    Event.Broadcast('delete-scene', this.id);
    return true;
  }

  GetFirstObject() { // TODO: Replace this with BG sprite
    if (!GameProperties.ProjectLoaded) return null;
    return GameProperties.instance.objectList.find(elem => elem.bindScene.id === this.id);
  }

  SelectOn() {
    this.selected = true;
    this.container.visible = true;
  }

  SelectOff() {
    this.selected = false;
    this.container.visible = false;
  }

  toJsonObject() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

module.exports = Scene;
