const ChildProcess = require('child_process');
const {
  PATH, ELECTRON, PROMPT, FS, Debug, ID, Event,
} = require('./Utilities/Utilities');
const Compiler = require('../../../Compiler/Compiler'); // TODO
const GameProperties = require('./GameProperties');
const Scene = require('./Scene');
const SceneObject = require('./SceneObject');
const State = require('./State');
const Interaction = require('./Interaction');
const Sound = require('./Sound');
const Image = require('./Image');

let instance = null;

class TempJsonObj {
  constructor() {
    this.sceneList = [];
    this.objectList = [];
    this.interactionList = [];
    this.stateList = [];
    this.soundList = [];
    this.imageList = [];
    this.settings = {};
    this.projectData = {};
  }

  reset() {
    this.sceneList = [];
    this.objectList = [];
    this.interactionList = [];
    this.stateList = [];
    this.soundList = [];
    this.imageList = [];
    this.settings = {};
    this.projectData = {};
  }
}

const tempJsonObj = new TempJsonObj();

class File {
  constructor(_path, _gameProperties) {
    this.path = _path;
    this.gameProperties = _gameProperties;
  }

  static Init(_path, _gameProperties) {
    instance = new File(_path, _gameProperties);
  }

  static get instance() {
    return instance;
  }

  static get extension() {
    return 'aap';
  }

  static get tempJsonObj() {
    return tempJsonObj;
  }

  static NewEmptyProject(callback) {
    const func = () => {
      PROMPT({
        title: 'New project',
        label: 'Give it a name: ',
        value: 'my-project',
      }).then((_name) => {
        if (_name != null) {
          File.Init(null, new GameProperties());
          File.instance.gameProperties.settings.projectName = _name;
          // Default settings
          const firstScene = Scene.AddScene('new scene');
          const bg = SceneObject.AddEmptyObject('backdrop', firstScene, false);
          firstScene.SetAsStartScene();
          firstScene.SelectOn();
          Sound.NewSound('correct', './Assets/sound/correct.mp3');
          Sound.NewSound('wrong', './Assets/sound/wrong.wav');
          Sound.NewSound('lock', './Assets/sound/lock.wav');
          Sound.NewSound('unlock', './Assets/sound/unlock.wav');
          Sound.NewSound('put', './Assets/sound/put.wav');
          Sound.NewSound('win', './Assets/sound/win.wav');
          Sound.NewSound('door', './Assets/sound/door.wav');
          Sound.NewSound('meow_1', './Assets/sound/meow_happy.wav');
          Sound.NewSound('meow_2', './Assets/sound/meow_unhappy.wav');

          Event.Broadcast('reload-project');
          if (typeof callback === 'function') {
            callback(_name);
          }
        }
      });
    };
    if (File.instance != null) { // have opened proj
      File.CloseProject(() => { func(); });
    } else {
      func();
    }
  }

  static NewProject(callback) {
    const func = () => {
      PROMPT({
        title: 'New project',
        label: 'Give it a name: ',
        value: 'my-project',
      }).then((_name) => {
        if (_name != null) {
          File.Init(null, new GameProperties());
          File.instance.gameProperties.settings.projectName = _name;
          // Default settings
          const firstScene = Scene.AddScene('default scene');
          const bg = SceneObject.AddEmptyObject('backdrop', firstScene, false);
          firstScene.SetAsStartScene();
          firstScene.SelectOn();
          Sound.NewSound('correct', './Assets/sound/correct.mp3');
          Sound.NewSound('wrong', './Assets/sound/wrong.wav');
          Sound.NewSound('lock', './Assets/sound/lock.wav');
          Sound.NewSound('unlock', './Assets/sound/unlock.wav');
          Sound.NewSound('put', './Assets/sound/put.wav');
          Sound.NewSound('win', './Assets/sound/win.wav');
          Sound.NewSound('door', './Assets/sound/door.wav');
          Sound.NewSound('meow_1', './Assets/sound/meow_happy.wav');
          Sound.NewSound('meow_2', './Assets/sound/meow_unhappy.wav');
          Event.Broadcast('reload-project');
          if (typeof callback === 'function') {
            callback(_name);
          }
        }
      });
    };
    if (File.instance != null) { // have opened proj
      File.CloseProject(() => { func(); });
    } else {
      func();
    }
  }

  static SaveProject(callback) {
    if (File.instance == null) { return; }
    if (File.instance.path == null) { // No path saved
      // Open file selector
      ELECTRON.dialog.showSaveDialog({
        title: 'Select folder',
        defaultPath: File.instance.gameProperties.settings.projectName,
        buttonLabel: 'Save',
        filters: [{ name: 'AliceAdventureProject', extensions: [File.extension] }],
      }, (_path) => { // callback
        if (_path == null) return;
        File.SaveToPath(_path);
        if (typeof callback === 'function') {
          callback(_path);
        }
      });
    } else { // Has path saved
      File.SaveToPath(File.instance.path);
      if (typeof callback === 'function') {
        callback(File.instance.path);
      }
    }
  }

  static SaveAsNewProject(callback) {
    if (File.instance == null) { return; }
    // open file selecter
    ELECTRON.dialog.showSaveDialog({
      title: 'Select folder',
      defaultPath: File.instance.gameProperties.settings.projectName,
      buttonLabel: 'Save',
      filters: [{ name: 'AliceAdventureProject', extensions: [File.extension] }],
      properties: ['openFile', 'createDirectory'],
    }, (_path) => { // callback
      if (_path == null) return;
      File.SaveToPath(_path);
      if (typeof callback === 'function') {
        callback(_path);
      }
    });
  }

  static OpenProject(callback) {
    const func = () => {
      // Open file selector
      ELECTRON.dialog.showOpenDialog({
        title: 'Select project',
        defaultPath: '',
        buttonLabel: 'Select',
        filters: [{ name: 'AliceAdventureProject', extensions: [File.extension] }],
        properties: ['openFile'],
      }, (_paths) => { // callback
        if (_paths == null) return;
        File.OpenFromPath(_paths[0]);
        if (typeof callback === 'function') {
          callback(_paths[0]);
        }
      });
    };
    if (File.instance != null) { // have opened proj
      File.CloseProject(() => { func(); });
    } else {
      func();
    }
  }

  static CloseProject(callback) {
    if (File.instance == null) {
      return; // No project loaded
    }
    if (window.confirm('Are you sure to close this project? \nUnsaved changes may be lost. ')) { // test
      File.instance = null;
      GameProperties.instance = null;
      Event.Broadcast('reload-project');
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  static BuildProject() {
    if (File.instance == null) return;
    if (File.instance.path == null) { // no existing file
      if (window.confirm('Your project is unsaved. \nSave it first?')) {
        File.SaveAsNewProject(() => {
          File.Build(() => {
            File.OpenBuildFolder();
          });
        });
      }
    } else {
      File.SaveToPath(File.instance.path);
      File.Build(() => {
        File.OpenBuildFolder();
      });
    }
  }

  static RunProject() {
    if (File.instance == null) return;
    // check if project saved
    if (File.instance.path == null) { // no existing file
      if (window.confirm('Your project is unsaved. \nSave it first?')) {
        File.SaveAsNewProject(() => {
          File.Build(() => {
            File.Run();
          });
        });
      }
    } else {
      File.SaveToPath(File.instance.path);
      File.Build(() => {
        File.Run();
      });
    }
  }

  static OpenBuildFolder() {
    const commandLine = `start ${PATH.join(PATH.dirname(File.instance.path), `${PATH.basename(File.instance.path, PATH.extname(File.instance.path))}-Build`).replace(/\\/g, '\\\\')}`;

    ChildProcess.exec(commandLine);
  }

  static ImportAssets() {
    ELECTRON.dialog.showOpenDialog({
      title: 'Import assets',
      defaultPath: '',
      buttonLabel: 'Import',
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }, { name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
      properties: ['openFile', 'multiSelections'],
    }, (_paths) => { // callback
      if (_paths == null) return;
      _paths.forEach((path) => {
        switch (path) {
          case 'mp3':
          case 'wav':
            Sound.NewSound(PATH.basename(path, PATH.extname(path)), path);
            break;
          case 'png':
          case 'jpg':
          case 'jpeg':
            Image.ImportImage(path);
            break;
          default:
            break;
        }
      });
    });
  }

  static ImportSound() { // test
    ELECTRON.dialog.showOpenDialog({
      title: 'Import sound',
      defaultPath: '',
      buttonLabel: 'Import',
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
      properties: ['openFile', 'multiSelections'],
    }, (_paths) => { // callback
      if (_paths == null) return;
      _paths.forEach((path) => {
        Sound.NewSound(PATH.basename(path, PATH.extname(path)), path);
      });
    });
  }

  static ImportImage() { // test
    ELECTRON.dialog.showOpenDialog({
      title: 'Import image',
      defaultPath: '',
      buttonLabel: 'Import',
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
      properties: ['openFile', 'multiSelections'],
    }, (_paths) => { // callback
      if (_paths == null) return;
      _paths.forEach((path) => {
        Image.ImportImage(path);
      });
    });
  }

  static SaveToPath(_path) {
    window.console.log(`Save to ${_path}`);
    File.instance.path = _path;
    File.tempJsonObj.reset();

    // sceneList
    GameProperties.instance.sceneList.forEach((scene) => {
      File.tempJsonObj.sceneList.push(scene.toJsonObject());
    });

    // objectList
    GameProperties.instance.objectList.forEach((obj) => {
      File.tempJsonObj.objectList.push(obj.toJsonObject());
    });

    // interationList
    GameProperties.instance.interactionList.forEach((interaction) => {
      File.tempJsonObj.interactionList.push(interaction.toJsonObject());
    });

    // stateList
    GameProperties.instance.stateList.forEach((state) => {
      File.tempJsonObj.stateList.push(state.toJsonObject());
    });

    // soundList
    GameProperties.instance.soundList.forEach((sound) => {
      File.tempJsonObj.soundList.push(sound.toJsonObject());
    });

    // imageList
    GameProperties.instance.imageList.forEach((image) => {
      File.tempJsonObj.imageList.push(image.toJsonObject());
    });

    // settings
    File.tempJsonObj.settings = GameProperties.instance.settings;

    // projData
    File.tempJsonObj.projectData.idCounter = ID.Counter;
    File.tempJsonObj.projectData.viewWidth = GameProperties.instance.projectData.viewWidth;
    File.tempJsonObj.projectData.viewHeight = GameProperties.instance.projectData.viewHeight;

    // Write JSON file
    FS.writeJsonSync(File.instance.path, File.tempJsonObj, { spaces: '\t', EOL: '\n' });

    // Ensure has Assets folder
    // FS.ensureDir(PATH.dirname(File.instance.path) + '/Assets/');
  }

  static OpenFromPath(_path) {
    // Load JSON file
    if (typeof _path !== 'string') {
      Debug.LogError('Path is not string: ');
      Debug.Log(_path);
      return;
    }
    File.init(_path, new GameProperties());
    const data = FS.readJsonSync(_path);

    if (data == null) {
      Debug.LogError("File doesn't exist");
      return;
    }

    // SceneList
    if (data.sceneList != null) {
      data.sceneList.forEach((scene) => {
        Scene.LoadScene(scene);
      });
    }

    // ObjectList
    if (data.objectList != null) {
      data.objectList.forEach((object) => {
        SceneObject.LoadObject(object);
      });
    }

    // stateList
    if (data.stateList != null) {
      data.stateList.forEach((state) => {
        State.LoadState(state);
      });
    }

    // Sound
    if (data.soundList != null) {
      data.soundList.forEach((sound) => {
        Sound.LoadSound(sound);
      });
    }

    // Image
    if (data.imageList != null) {
      data.imageList.forEach((image) => {
        Image.LoadImage(image);
      });
    }

    // Interaction
    if (data.interactionList != null) {
      data.interactionList.forEach((interaction) => {
        Interaction.LoadInteraction(interaction);
      });
    }

    // Settings
    File.instance.gameProperties.settings.resWidth = data.settings.resWidth;
    File.instance.gameProperties.settings.resHeight = data.settings.resHeight;
    File.instance.gameProperties.settings.inventoryGridNum = data.settings.inventoryGridNum;
    File.instance.gameProperties.settings.startScene = data.settings.startScene;
    File.instance.gameProperties.settings.projectName = data.settings.projectName;

    // ProjData
    ID.setCounter(data.projectData.idCounter);

    // Init operation
    GameProperties.GetSceneById(GameProperties.instance.settings.startScene).SelectOn();

    Event.Broadcast('reload-project');
  }

  static Build(successCallback) {
    const compiler = new Compiler(File.instance.path, (_err) => { Debug.LogError(_err); });
    if (compiler.build((_err) => { Debug.LogError(_err); })) { // success
      Debug.Log('Build succeeded');
      if (typeof successCallback === 'function') successCallback();
    } else { // fail
      Debug.Log('Build failed with error');
    }
  }

  static Run() {
    Event.Broadcast('run-in-editor', PATH.join(PATH.dirname(File.instance.path), `${PATH.basename(File.instance.path, PATH.extname(File.instance.path))}-Build/index.html`));
  }
}
module.exports = File;
