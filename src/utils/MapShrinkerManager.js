import GameStatusText from "../components/info/GameStatusText";
import SocketManager from "./SocketManager";

export default class MapShrinkerManager {
  constructor(
    scene,
    {
      delay = 15000,
      minWidth = 1400,
      minHeight = 1400,
      initialWidth = 3840,
      initialHeight = 3200,
      tileWidth = 32,
      tileHeight = 32,
    } = {}
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

    // Initialize graphics object for overlay
    this.whiteGraphics = this.scene.add
      .graphics({
        fillStyle: { color: 0xffffff, alpha: 0.5 },
      })
      .setDepth(10);

    this.statusText = new GameStatusText(this.scene);

    SocketManager.onMapShrink(this.handleMapShrink.bind(this));

    this.overlayedTiles = {};
  }

  handleMapShrink(shrinkFactor) {
    if (shrinkFactor === 0) {
      this.statusText.showText("맵이 줄어들기 시작합니다!", "64px", 3000, 1, 0);
    }

    if (this.currentShrinkFactor < shrinkFactor) {
      for (
        let factor = this.currentShrinkFactor + 1;
        factor <= shrinkFactor;
        factor++
      ) {
        this.applyShrinkFactor(factor);
      }
      this.currentShrinkFactor = shrinkFactor;
    }
  }

  overlayTile(layer, tileX, tileY) {
    const key = `${tileX},${tileY}`;
    if (this.overlayedTiles[key]) return;

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

  applyShrinkFactor(shrinkFactor) {
    const layer = this.scene.mapShrink;

    // Calculate the new width and height based on the shrink factor
    const width = this.initialWidth - this.tileWidth * shrinkFactor;
    const height = this.initialHeight - this.tileHeight * shrinkFactor;

    // Calculate the number of tiles in each dimension
    const tileXMax = Math.ceil(width / this.tileWidth);
    const tileYMax = Math.ceil(height / this.tileHeight);

    // Overlay the tiles around the edges
    for (let x = 0; x <= tileXMax; x++) {
      this.overlayTile(layer, x, 0); // Top edge
      this.overlayTile(layer, x, tileYMax); // Bottom edge
    }

    for (let y = 0; y <= tileYMax; y++) {
      this.overlayTile(layer, 0, y); // Left edge
      this.overlayTile(layer, tileXMax, y); // Right edge
    }

    // Update the physics world bounds to match the new size
    this.scene.physics.world.setBounds(0, 0, width, height);
    layer.setCollisionByExclusion([-1], true);
  }

  reset() {
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
