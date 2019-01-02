const { IPC } = require('./Utilities/Utilities');
const File = require('./File');
const View = require('./View');

class WelcomeView extends View {
  constructor(_bindElementID, _height = -1, _width = -1) {
    super('WelcomeView', _height, _height, _bindElementID);
    this.vModel = null;
  }

  static NewView(_elementID) {
    const view = new WelcomeView(_elementID);
    view.InitView();
    return view;
  }

  InitView() {
    // eslint-disable-next-line no-undef
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
      },
      methods: {
        newWiz: () => {
          File.NewEmptyProject(() => {
            File.SaveAsNewProject((path) => {
              IPC.send('new-wiz', path);
            });
          });
        },
        newProj: () => {
          File.NewEmptyProject(() => {
            File.SaveAsNewProject((path) => {
              IPC.send('open-proj', path);
            });
          });
        },
        openProj: () => { File.OpenProject((path) => { IPC.send('open-proj', path); }); },
        exit: () => { IPC.send('exit'); },
      },
    });
  }
}
module.exports = WelcomeView;
