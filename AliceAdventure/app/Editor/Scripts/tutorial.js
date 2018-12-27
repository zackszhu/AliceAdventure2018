const AliceEditor = require('../Scripts/AliceEditor');

const views = {
  tutorialView: AliceEditor.TutorialView.NewView('step_1'),
  sceneView: AliceEditor.SceneView.NewView('scene-editor'),
  propertyView: AliceEditor.PropertyView.NewView('design-property'),
  galleryView: AliceEditor.GalleryView.NewView('gallery-modal'),
  objectListView: AliceEditor.ObjectListView.NewView('object-list'),
  interactionView: AliceEditor.InteractionView.NewView('interaction-editor'),
  iLibraryView: AliceEditor.ILibraryView.NewView('interaction-library'),
};

const transit = {
  back: () => {
    views.tutorialView.vModel.back();
  },
  next: () => {
    views.tutorialView.vModel.next();
  },
  skip: () => {
    views.tutorialView.vModel.skip();
  },
  finish: () => {
    views.tutorialView.vModel.finish();
  },
  exit: () => {
    views.tutorialView.vModel.exit();
  },
};

const util = {
  selectBackdrop: () => {
    views.galleryView.vModel.showCategory = {
      backdrop: true,
      character: false,
      item: false,
      others: false,
      sound: false,
      myImage: true,
      mySound: false,
    };
  },
  selectCharacter: () => {
    views.galleryView.vModel.showCategory = {
      backdrop: false,
      character: true,
      item: false,
      others: false,
      sound: false,
      myImage: true,
      mySound: false,
    };
  },
  selectItem: () => {
    views.galleryView.vModel.showCategory = {
      backdrop: false,
      character: false,
      item: true,
      others: false,
      sound: false,
      myImage: true,
      mySound: false,
    };
  },
};
