const {
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');

class GameSettingView extends View {
  constructor(bindElementID, height = -1, width = -1) {
    super('GameSettingView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementID) {
    return new GameSettingView(elementID);
  }

  InitView() {
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        projLoaded: false,
        sceneOptions: null,
        gridNumOptions: [0, 5, 6, 7, 8, 9, 10],
        resOptions: [{
          w: 1600,
          h: 1200,
        }, {
          w: 1280,
          h: 960,
        }, {
          w: 800,
          h: 600,
        }, {
          w: 640,
          h: 480,
        }],
        res: {
          w: null,
          h: null,
        },
        settings: null,
      },
      methods: {
        changeRes: () => {
          this.vModel.settings.resWidth = this.vModel.res.w;
          this.vModel.settings.resHeight = this.vModel.res.h;
        },
      },
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
    Event.AddListener('delete-scene', (id) => {
      GameSettingView.HandleDeleteScene(id);
    });
  }

  ReloadView() {
    if (GameProperties.instance == null) {
      this.vModel.projLoaded = false;
      this.vModel.sceneOptions = null;
      this.vModel.settings = null;
    } else {
      this.vModel.projLoaded = true;
      this.vModel.sceneOptions = GameProperties.instance.sceneList;
      this.vModel.settings = GameProperties.instance.settings;
      this.vModel.res = {
        w: GameProperties.instance.settings.resWidth,
        h: GameProperties.instance.settings.resHeight,
      };
    }
  }

  static HandleDeleteScene(id) {
    if (GameProperties.instance.settings.startScene === id) {
      GameProperties.instance.settings.startScene = GameProperties.instance.sceneList[0].id;
    }
  }
}

module.exports = GameSettingView;
