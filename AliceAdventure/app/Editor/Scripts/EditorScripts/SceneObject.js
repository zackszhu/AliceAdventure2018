const {
  PIXI,
  ID,
  Event,
} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Resizer = require('./Resizer');

const pixiFilters = { // private
  outlineFilterGreen: new PIXI.filters.OutlineFilter(4, 0x99ff99),
  outlineFilterRed: new PIXI.filters.OutlineFilter(4, 0xff9999),
};

class SceneObject {
  constructor(id = null, name = 'untitled', src = '', bindScene = {
    id: 0,
    name: 'inventory',
  }, clickable = true, draggable = false) {
    this.id = id === null ? ID.NewID : id;
    this.name = name;
    this.src = src;
    this.bindScene = bindScene;
    this.clickable = clickable;
    this.draggable = draggable;

    this.selectAllowed = true;
    this.selected = false;
    this.dragAllowed = true;
    this.drag = {
      on: false,
      eventData: {},
      offset: {
        x: 0,
        y: 0,
      },
    };

    this.isBackdrop = false; // TODO: Remove this
    this.isCharacter = false; // TODO: Remove this
    this.sprite = null;
    this.filter = pixiFilters.outlineFilterGreen;
  }

  static AddEmptyObject(name, bindScene, assignedPos = true) {
    if (GameProperties.instance == null) return null;

    const defaultObj = {
      src: '../../Assets/picture.png',
      name,
    };
    const index = GameProperties.instance.objectList.length;
    let defaultPos = {
      x: 240,
      y: 180,
    }; // center
    if (assignedPos) {
      // TODO: Why these constants
      const xStep = 80;
      const yStep = 72;
      const xNum = 5;
      const yNum = 4;
      defaultPos = {
        x: ((index % xNum) + 1) * xStep,
        y: ((Math.floor(index / xNum) % yNum) + 1) * yStep,
      };
    }
    const scene = bindScene == null ? GameProperties.instance.sceneList[0] : bindScene;
    const obj = new SceneObject(null, defaultObj.name, defaultObj.src, scene);
    GameProperties.AddObject(obj);
    obj.InitSprite(defaultObj.src);
    obj.SetSprite(null, defaultPos);
    return obj;
  }

  static AddObject(objInfo, bindScene) {
    if (GameProperties.instance == null) return null;
    const path = objInfo.src;
    const obj = new SceneObject(null, objInfo.name, path, bindScene);
    GameProperties.AddObject(obj);
    obj.InitSprite(path);
    return obj;
  }

  static LoadObject(data) {
    if (GameProperties.instance == null) return null; // no proj loaded
    const obj = new SceneObject(data.id, data.name, data.src,
      GameProperties.GetSceneById(data.bindScene), data.clickable, data.draggable);
    GameProperties.AddObject(obj);
    obj.InitSprite(data.src);
    obj.SetSprite(null, data.pos, data.scale, data.anchor, data.active);

    if (obj.bindScene.GetFirstObject().id === obj.id) {
      // TODO: get rid of this
      obj.isBackdrop = true;
      obj.bindScene.bgSrc = obj.src;
    }
    return obj;
  }

  InitSprite(url) {
    // TODO: Set src as url?
    if (!(this instanceof SceneObject)) return;
    this.sprite = PIXI.Sprite.fromImage(url);
    if (this.bindScene.container != null) this.bindScene.container.addChild(this.sprite);
    this.SpriteInfoDefault();
  }

  SetSprite(url, pos, scale, anchor, active) {
    if (this.sprite == null) {
      window.console.log('sprite not inited');
      return;
    } // must be initiated before
    if (url != null) {
      this.src = url;
      this.sprite.setTexture(PIXI.Texture.fromImage(url));
    }
    if (pos != null) {
      this.sprite.x = pos.x;
      this.sprite.y = pos.y;
    }
    if (scale != null) {
      this.sprite.scale.set(scale.x, scale.y);
    }
    if (anchor != null) {
      this.sprite.anchor.set(anchor.x, anchor.y);
    }
    if (active != null) {
      this.sprite.visible = active;
    }

    if (this.bindScene.GetFirstObject().id === this.id) {
      // TODO: get rid of this
      this.bindScene.bgSrc = url;
    }
  }

  SpriteInfoDefault() {
    // TODO: Rename
    if (this.sprite == null) return;
    this.sprite.x = 240;
    this.sprite.y = 180;
    this.sprite.scale.set(0.5, 0.5);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = true;
    this.sprite.interactive = true;
    this.sprite
      .on('pointerdown', (e) => {
        this.OnPointerDown(e);
      })
      .on('pointermove', (e) => {
        this.OnPointerMove(e);
      })
      .on('pointerup', (e) => {
        this.OnPointerUp(e);
      })
      .on('pointerupoutside', (e) => {
        this.OnPointerUp(e);
      })
      .on('pointerover', (e) => {
        this.OnPointerOver(e);
      })
      .on('pointerout', (e) => {
        this.OnPointerOut(e);
      });
    this.sprite.id = this.id;
  }

  SwitchScene(toScene, aboveObj) {
    if (toScene.id === 0) { // inventory
      window.console.log('to inv');
      if (this.sprite.parent != null) {
        this.sprite.parent.removeChild(this.sprite);
      }
      this.bindScene = toScene;
      return;
    }

    if (aboveObj == null) {
      toScene.container.addChildAt(this.sprite, 0);
    } else {
      if (this.id === aboveObj.id) return;

      const indexA = toScene.container.children.findIndex(elem => elem.id === this.id);
      const indexB = toScene.container.children.findIndex(elem => elem.id === aboveObj.id);

      if (indexA === indexB + 1) {
        // If already exists
        return;
      }

      if (indexA === -1) {
        // If not yet exist
        toScene.container.addChildAt(this.sprite, indexB + 1);
      } else if (indexA > indexB) {
        toScene.container.addChildAt(this.sprite, indexB + 1);
      } else {
        toScene.container.addChildAt(this.sprite, indexB);
      }
    }

    this.bindScene = toScene;
    GameProperties.updateOrderByScene(toScene);
  }

  ToggleLock() {
    this.dragAllowed = !this.dragAllowed;
    if (this.dragAllowed) {
      this.filter = pixiFilters.outlineFilterRed;
      if (this.selected) {
        this.sprite.filters = [this.filter];
      }
    } else {
      this.filter = pixiFilters.outlineFilterRed;
      if (this.selected) {
        this.sprite.filters = [this.filter];
      }
      Resizer.hideHelper();
    }
  }

  DeleteThis() {
    if (this.sprite != null) {
      if (this.sprite.parent != null) this.sprite.parent.removeChild(this.sprite);
      this.sprite.destroy();
    }
    GameProperties.DeleteObject(this);
    Event.Broadcast('delete-object', this.id);
  }

  SelectOn() {
    this.selected = true;
    this.sprite.filters = [this.filter];
    // TODO: Why commented it out?
    // Resizer.showHelper(this.sprite);
  }

  SelectOff() {
    this.selected = false;
    this.sprite.filters = [];
    Resizer.hideHelper(this.sprite);
  }

  OnPointerDown(event) {
    if (this.selectAllowed) {
      Event.Broadcast('object-sprite-click', this);
    }

    // Start dragging
    if (this.dragAllowed) {
      this.drag.on = true;
      this.drag.eventData = event.data;
      this.drag.offset = this.drag.eventData.getLocalPosition(this.sprite.parent);
      this.drag.offset.x -= this.sprite.x;
      this.drag.offset.y -= this.sprite.y;
      Resizer.showHelper(this.sprite);
    }
  }

  OnPointerMove(event) {
    if (this.dragAllowed && this.drag.on) {
      const newPosition = this.drag.eventData.getLocalPosition(this.sprite.parent);
      this.sprite.x = Math.floor(newPosition.x) - this.drag.offset.x;
      this.sprite.y = Math.floor(newPosition.y) - this.drag.offset.y;
      Resizer.updateBox();
    }
  }

  OnPointerUp(event) {
    if (this.dragAllowed) {
      this.drag.on = false;
    }
  }

  OnPointerOver(event) {
    if (this.dragAllowed && this.selected) {
      Resizer.showHelper(this.sprite);
    }
  }

  OnPointerOut(event) {
    if (this.dragAllowed && this.selected) {
      // TODO: Why commented it out?
      // Resizer.hideHelper();
    }
  }

  toJsonObject() {
    return {
      id: this.id,
      name: this.name,
      src: this.src,
      // isDefault: this.isDefault,
      pos: {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      anchor: {
        x: this.sprite.anchor.x,
        y: this.sprite.anchor.y,
      },
      scale: {
        x: this.sprite.scale.x,
        y: this.sprite.scale.y,
      },
      active: this.sprite.visible,
      clickable: this.clickable,
      draggable: this.draggable,
      bindScene: this.bindScene.id,
      // properties: _o.properties,
    };
  }
}

module.exports = SceneObject;
