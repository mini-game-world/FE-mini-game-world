import Phaser from "phaser";
import GameStatusText from "../components/GameStatusText";
import SocketManager from "./SocketManager"; // 경로는 실제 파일 위치에 따라 조정

export default class MapShrinker {
  constructor(
    scene,
    delay = 15000,
    minWidth = 1400,
    minHeight = 1400,
    initialWidth = 3840,
    initialHeight = 2560,
    tileWidth = 32,
    tileHeight = 32
  ) {
    this.scene = scene;
    this.delay = delay;
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.currentWidth = initialWidth;
    this.currentHeight = initialHeight;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.currentShrinkFactor = 0;

    this.whiteGraphics = this.scene.add.graphics();
    this.whiteGraphics.fillStyle(0xffffff);
    this.whiteGraphics.setDepth(10);
    this.whiteGraphics.setAlpha(0.5);

    this.statusText = new GameStatusText(this.scene);

    this.socketManager = SocketManager;
    this.socketManager.onMapShrink(this.handleMapShrink.bind(this));

    this.overlayedTiles = {};
  }

  handleMapShrink(shrinkFactor) {
    console.log(`Map is shrinking with factor ${shrinkFactor}`);
    const layer = this.scene.mapShrink;

    if (shrinkFactor === 0) {
      this.statusText.showText("맵이 줄어들기 시작합니다!", "64px", 3000, 1, 0);
    }

    if (this.currentShrinkFactor < shrinkFactor) {
      for (let factor = this.currentShrinkFactor + 1; factor <= shrinkFactor; factor++) {
        this.applyShrinkFactor(factor);
      }
      this.currentShrinkFactor = shrinkFactor;
    } else {
      console.log("Map has reached minimum size.");
    }
  }

  // handleMapShrink(shrinkFactor) {
  //   console.log(`Map is shrinking with factor ${shrinkFactor}`);
  //   const layer = this.scene.mapShrink;

  //   if (shrinkFactor === 0) {
  //     this.statusText.showText("맵이 줄어들기 시작합니다!", "64px", 3000, 1, 0);
  //   }

  //   if (this.currentShrinkFactor !== shrinkFactor) {

  //     this.currentShrinkFactor = shrinkFactor;

  //     this.currentWidth = this.initialWidth - this.tileWidth * shrinkFactor;
  //     this.currentHeight = this.initialHeight - this.tileHeight * shrinkFactor;

  //     const tileXMax = Math.ceil(this.currentWidth / this.tileWidth);
  //     const tileYMax = Math.ceil(this.currentHeight / this.tileHeight);

  //     for (let x = -1; x < tileXMax; x++) {
  //       this.overlayTile(layer, x, -1);
  //       this.overlayTile(layer, x, tileYMax);
  //     }

  //     for (let y = -1; y < tileYMax; y++) {
  //       this.overlayTile(layer, -1, y);
  //       this.overlayTile(layer, tileXMax - 1, y);
  //     }

  //     this.scene.physics.world.setBounds(
  //       0,
  //       0,
  //       this.currentWidth,
  //       this.currentHeight
  //     );

  //     layer.setCollisionByExclusion([-1], true);
  //   } else {
  //     console.log("Map has reached minimum size.");
  //   }
  // }

  overlayTile(layer, tileX, tileY) {

    const key = `${tileX},${tileY}`;
    if (this.overlayedTiles[key]) {
      return; // 이미 덮어씌워진 타일은 무시
    }

    const tile = layer.getTileAt(tileX, tileY);
    const pixelX = tileX * this.tileWidth;
    const pixelY = tileY * this.tileHeight;

    this.whiteGraphics.fillRect(
      pixelX,
      pixelY,
      this.tileWidth,
      this.tileHeight
    );

    this.overlayedTiles[key] = true;
  }

  applyShrinkFactor(factor) {
    const layer = this.scene.mapShrink;

    const width = this.initialWidth - this.tileWidth * factor;
    const height = this.initialHeight - this.tileHeight * factor;

    const tileXMax = Math.ceil(width / this.tileWidth);
    const tileYMax = Math.ceil(height / this.tileHeight);

    for (let x = -1; x < tileXMax; x++) {
      this.overlayTile(layer, x, -1);
      this.overlayTile(layer, x, tileYMax );
    }

    for (let y = -1; y < tileYMax; y++) {
      this.overlayTile(layer, -1, y);
      this.overlayTile(layer, tileXMax - 1, y);
    }

    this.scene.physics.world.setBounds(
      0,
      0,
      width,
      height
    );

    layer.setCollisionByExclusion([-1], true);
  }

  applyPreviousShrinks() {
    this.applyShrinkFactor(this.currentShrinkFactor);
  }

  reset() {
    console.log("MapShrinker reset called");
    this.currentWidth = this.initialWidth;
    this.currentHeight = this.initialHeight;
    this.whiteGraphics.clear();
    this.scene.physics.world.setBounds(
      0,
      0,
      this.currentWidth,
      this.currentHeight
    );
    this.overlayedTiles = {};
    this.currentShrinkFactor = 0;

    const layer = this.scene.mapShrink;
    layer.setCollisionByExclusion([-1], true);
  }
}
