const {
  FS,
  Event,
} = require('./Utilities/Utilities');
const View = require('./View');

class RunView extends View {
  constructor(bindElementID, height, width) {
    super('RunView', height, width, bindElementID);
    this.vModel = null;
  }

  static NewView(elementId) {
    const view = new RunView(elementId);
    view.InitView();
    return view;
  }

  InitView() {
    // eslint-disable-next-line no-undef
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        showRunView: false,
        src: null,
      },
      methods: {
        stop: () => {
          this.Terminate();
        },
        replay: () => {
          this.Replay();
        },
      },
    });

    Event.AddListener('run-in-editor', (_path) => {
      this.Start(_path);
    });
  }

  Start(path) {
    if (FS.existsSync(path)) {
      this.vModel.showRunView = true;
      this.vModel.src = path;
    }
  }

  Terminate() {
    this.vModel.showRunView = false;
    this.vModel.src = null;
  }

  Replay() {
    this.vModel.showRunView = false;
    window.setTimeout(() => {
      this.vModel.showRunView = true;
    }, 10);
  }
}

module.exports = RunView;
