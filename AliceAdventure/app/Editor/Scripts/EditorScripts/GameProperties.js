/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
let instance = null;

class GameProperties {
  constructor() {
    this.sceneList = [];
    this.objectList = [];
    this.interactionList = [];
    this.stateList = [];
    this.soundList = [];
    this.imageList = [];
    this.settings = {
      resWidth: 1280,
      resHeight: 960,
      inventoryGridNum: 5,
      startScene: -1,
      projectName: 'untitled',
    };
    this.projectData = {
      idCounter: 0,
      viewWidth: 480,
      viewHeight: 360,
    };
  }

  static get instance() {
    if (instance === null) {
      instance = new GameProperties();
    }
    return instance;
  }

  static getIndexOfScene(scene) {
    for (let i = 0; i < GameProperties.instance.sceneList.length; i += 1) {
      const currScene = GameProperties.instance.sceneList[i];
      if (currScene.id === scene.id) {
        return i;
      }
    }
    return -1;
  }

  static popSceneToTop(scene) {
    const index = GameProperties.getIndexOfScene(scene);

    GameProperties.instance.sceneList.splice(index, 1);
    GameProperties.instance.sceneList.splice(0, 0, scene);
  }

  static moveSceneAfterScene(sceneA, sceneB) {
    const indexA = GameProperties.getIndexOfScene(sceneA);
    const indexB = GameProperties.getIndexOfScene(sceneB);

    if (indexA === indexB + 1) return;

    if (indexA < indexB) {
      GameProperties.instance.sceneList.splice(indexB + 1, 0, sceneA);
      GameProperties.instance.sceneList.splice(indexA, 1);
    } else {
      GameProperties.instance.sceneList.splice(indexA, 1);
      GameProperties.instance.sceneList.splice(indexB + 1, 0, sceneA);
    }
  }

  static showObjNames() {
    if (GameProperties.instance === null) return;
    GameProperties.instance.objectList.forEach((obj) => {
      window.console.log(obj.name);
    });
  }

  static updateOrderByScene(scene) {
    if (!GameProperties.ProjectLoaded) return;
    const objInScene = scene.container.children;

    const original = [];
    const organized = [];

    // TODO: Refactor it later, try it out in the editor
    for (const i in GameProperties.instance.objectList) {
      const objInList = GameProperties.instance.objectList[i];
      if (objInList.bindScene.id === scene.id) {
        for (const j in objInScene) {
          if (objInScene[j].id === objInList.id) {
            organized[j] = objInList;
          }
        }
        original.push(objInList);
      }
    }

    let index = 0;
    for (const i in GameProperties.instance.objectList) {
      const objInList = GameProperties.instance.objectList[i];
      if (objInList.bindScene.id === scene.id) {
        GameProperties.instance.objectList.splice(i, 1, organized[index]);
        index += 1;
      }
    }
  }

  static get ProjectLoaded() {
    return instance !== null;
  }

  static SetViewSize(w, h) {
    if (!GameProperties.ProjectLoaded) return;

    GameProperties.instance.projectData.viewWidth = w;
    GameProperties.instance.projectData.viewHeight = h;
  }

  static GetElemById(elemArray, id) {
    if (!GameProperties.ProjectLoaded) return null;
    return elemArray.findIndex(elem => elem.id === id);
  }

  static AddElemToArray(elem, array) {
    if (!GameProperties.ProjectLoaded) return false;
    array.push(elem);
    return true;
  }

  static DeleteElemFromArray(elem, array) {
    if (!GameProperties.ProjectLoaded) return false;
    const index = array.indexOf(elem);
    if (index >= 0) {
      array.splice(elem, 1);
      return true;
    }
    return false;
  }

  static GetSceneById(id) {
    if (id === 0) {
      return {
        id: 0,
        name: 'Inventory',
      };
    }
    return GameProperties.GetElemById(GameProperties.instance.sceneList, id);
  }

  static GetSceneLength() {
    if (!GameProperties.ProjectLoaded) return null;
    return GameProperties.instance.sceneList.length;
  }

  static GetObjectById(id) {
    return GameProperties.GetElemById(GameProperties.instance.objectList, id);
  }

  static GetInteractionById(id) {
    return GameProperties.GetElemById(GameProperties.instance.interactionList, id);
  }

  static GetStateById(id) {
    return GameProperties.GetElemById(GameProperties.instance.stateList, id);
  }

  static GetSoundById(id) {
    return GameProperties.GetElemById(GameProperties.instance.soundList, id);
  }

  static GetImageById(id) {
    return GameProperties.GetElemById(GameProperties.instance.imageList, id);
  }

  static AddScene(scene) {
    return GameProperties.AddElemToArray(GameProperties.instance.sceneList, scene);
  }

  static DeleteScene(scene) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.sceneList, scene);
  }

  static AddObject(obj) {
    return GameProperties.AddElemToArray(GameProperties.instance.objectList, obj);
  }

  static DeleteObject(obj) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.objectList, obj);
  }

  static AddInteraction(interaction) {
    return GameProperties.AddElemToArray(GameProperties.instance.interactionList, interaction);
  }

  static DeleteInteraction(interaction) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.interactionList, interaction);
  }

  static AddState(state) {
    return GameProperties.AddElemToArray(GameProperties.instance.stateList, state);
  }

  static DeleteState(state) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.stateList, state);
  }

  static AddSound(sound) {
    return GameProperties.AddElemToArray(GameProperties.instance.soundList, sound);
  }

  static DeleteSound(sound) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.soundList, sound);
  }

  static AddImage(image) {
    return GameProperties.AddElemToArray(GameProperties.instance.imageList, image);
  }

  static DeleteImage(image) {
    return GameProperties.DeleteElemFromArray(GameProperties.instance.imageList, image);
  }
}

module.exports = GameProperties;
