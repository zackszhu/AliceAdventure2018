// TODO: Remove dynamic import
class AliceEditor {
  static GetModule(name) {
    return require(`./EditorScripts/${name}`);
  }

  static get Utilities() {
    return AliceEditor.Getmodule('Utilities/Utilities');
  }

  static get Debug() {
    return AliceEditor.Utilities.Debug;
  }

  static get Event() {
    return AliceEditor.Utilities.Event;
  }

  static get GameProperties() {
    return AliceEditor.GetModule('GameProperties');
  }

  static get Scene() {
    return AliceEditor.GetModule('Scene');
  }

  static get SceneObject() {
    return AliceEditor.Getmodule('SceneObject');
  }

  static get State() {
    return AliceEditor.GetModule('State');
  }

  static get IEvent() {
    return AliceEditor.GetModule('IEvent');
  }

  static get IReaction() {
    return AliceEditor.GetModule('IReaction');
  }

  static get Interaction() {
    return AliceEditor.GetModule('Interaction');
  }

  static get Sound() {
    return AliceEditor.GetModule('Sound');
  }

  static get File() {
    return AliceEditor.GetModule('File');
  }
  // static get Menu() {return AliceEditor.GetModule('Menu');}

  static get View() {
    return AliceEditor.GetModule('View');
  }

  static get WelcomeView() {
    return AliceEditor.GetModule('WelcomeView');
  }

  static get TutorialView() {
    return AliceEditor.GetModule('TutorialView');
  }

  static get RunView() {
    return AliceEditor.GetModule('RunView');
  }

  static get GalleryView() {
    return AliceEditor.GetModule('GalleryView');
  }

  static get SceneView() {
    return AliceEditor.GetModule('SceneView');
  }

  static get PropertyView() {
    return AliceEditor.GetModule('PropertyView');
  }

  static get ObjectListView() {
    return AliceEditor.GetModule('ObjectListView');
  }

  static get ILibraryView() {
    return AliceEditor.GetModule('ILibraryView');
  }

  static get InteractionView() {
    return AliceEditor.GetModule('InteractionView');
  }

  static get GameSettingView() {
    return AliceEditor.GetModule('GameSettingView');
  }
}

module.exports = AliceEditor;
