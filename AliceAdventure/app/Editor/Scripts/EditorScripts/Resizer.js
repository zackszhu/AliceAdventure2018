const {
  PIXI,
} = require('./Utilities/Utilities');

class Resizer {
  constructor() {
    this.helperContainer = null;
    this.graphics = null;
    this.curScene = null;
    this.curObj = null;
    this.init();
  }

  init() {
    this.helperContainer = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.helperContainer.addChild(this.graphics);
    this.initSquares();
    this.helperContainer.visible = false;
  }

  initSquares() {
    for (let i = 0; i < 4; i += 1) {
      const sqr = this.createSquare(0, 0);
      switch (i) {
        case 0:
          sqr.tint = 0x00ff00;
          break;
        case 1:
          sqr.tint = 0x00ff00;
          break;
        case 2:
          sqr.tint = 0x00ff00;
          break;
        case 3:
          sqr.tint = 0x00ff00;
          break;
        default:
          break;
      }
      sqr.idx = i;
      this.helperContainer.addChild(sqr);
    }
  }

  drawLines(rect) {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.graphics.drawShape(rect);
  }

  setSquares(bound) {
    const center = {
      x: bound.x + bound.width / 2,
      y: bound.y + bound.height / 2,
    };
    const cornerPos = [0, 0, 0, 0];

    cornerPos[0] = [
      (this.curObj.scale.x > 0) ? center.x - bound.width / 2 : center.x + bound.width / 2,
      this.curObj.scale.y > 0 ? center.y - bound.height / 2 : center.y + bound.height / 2,
    ];

    cornerPos[1] = [
      (this.curObj.scale.x > 0) ? center.x + bound.width / 2 : center.x - bound.width / 2,
      this.curObj.scale.y > 0 ? center.y - bound.height / 2 : center.y + bound.height / 2,
    ];

    cornerPos[2] = [
      (this.curObj.scale.x > 0) ? center.x - bound.width / 2 : center.x + bound.width / 2,
      this.curObj.scale.y > 0 ? center.y + bound.height / 2 : center.y - bound.height / 2,
    ];

    cornerPos[3] = [
      (this.curObj.scale.x > 0) ? center.x + bound.width / 2 : center.x - bound.width / 2,
      this.curObj.scale.y > 0 ? center.y + bound.height / 2 : center.y - bound.height / 2,
    ];


    for (let i = 0; i < 4; i += 1) {
      this.helperContainer.getChildAt(i + 1).position.set(cornerPos[i][0], cornerPos[i][1]);
    }
  }

  createSquare(x, y) {
    const square = new PIXI.Sprite(PIXI.Texture.WHITE);
    square.factor = 1;
    square.anchor.set(0.5);
    square.position.set(x, y);
    square.interactive = true;

    square.buttonMode = true;
    square.cursor = 'crosshair';
    square
      .on('pointerdown', this.helperDragStart)
      .on('pointerup', this.helperDragEnd)
      .on('pointerupoutside', this.helperDragEnd)
      .on('pointermove', this.helperDragMove);

    return square;
  }

  showHelper(obj, scene) {
    this.curScene = obj.parent;
    this.curObj = obj;

    this.setSquares(this.curObj.getBounds());
    this.drawLines(this.curObj.getBounds());
    this.helperContainer.visible = true;
    this.curScene.addChild(this.helperContainer);
  }

  hideHelper() {
    if (this.curScene && this.curObj) {
      this.graphics.clear();
      this.curScene.removeChild(this.helperContainer);
      this.curScene = null;
      this.curObj = null;
      this.helperContainer.visible = false;
    }
  }

  updateSquares(dragSqr) {
    const xUp = ((dragSqr.idx === 0) || (dragSqr.idx === 2)) ? (this.curObj.x - dragSqr.x) : (dragSqr.x - this.curObj.x);
    const yUp = ((dragSqr.idx === 0) || (dragSqr.idx === 1)) ? (this.curObj.y - dragSqr.y) : (dragSqr.y - this.curObj.y);

    const xScale = xUp / (this.curObj.texture.orig.width / 2);
    const yScale = yUp / (this.curObj.texture.orig.height / 2);

    this.curObj.scale.set(xScale, yScale);
    this.updateBox();
  }

  updateBox() {
    this.drawLines(this.curObj.getBounds());
    this.setSquares(this.curObj.getBounds());
  }

  helperDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  helperDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  helperDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
      this.updateSquares(this);
    }
  }
}

module.exports = new Resizer();
