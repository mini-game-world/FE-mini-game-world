// src/utils/MapShrinker.js
export default class MapShrinker {
    constructor(scene, delay, interval, minWidth, minHeight, initialWidth, initialHeight, tileWidth, tileHeight) {
      this.scene = scene;
      this.delay = delay;
      this.interval = interval;
      this.minWidth = minWidth;
      this.minHeight = minHeight;
      this.currentWidth = initialWidth;
      this.currentHeight = initialHeight;
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
      this.timer = null;
  
      // Create a red transparent graphics object
      this.redGraphics = this.scene.add.graphics();
      this.redGraphics.fillStyle(0xff0000, 0.5);
      this.redGraphics.setDepth(10); // Ensure it is above other layers
  
      console.log("MapShrinker initialized");
      console.log(`Initial Width: ${this.currentWidth}, Initial Height: ${this.currentHeight}`);
      console.log(`Min Width: ${this.minWidth}, Min Height: ${this.minHeight}`);
    }
  
    start() {
      console.log("MapShrinker start called");
      setTimeout(() => {
        this.timer = setInterval(() => {
          console.log("Map shrinking interval triggered");
          const layer = this.scene.mapShrink; // Adjust the layer you want to shrink
  
          console.log(`Current Width: ${this.currentWidth}, Min Width: ${this.minWidth}`);
          console.log(`Current Height: ${this.currentHeight}, Min Height: ${this.minHeight}`);
  
          if (this.currentWidth > this.minWidth && this.currentHeight > this.minHeight) {
            this.shrinkLayer(layer);
  
            // Recalculate world bounds
            this.scene.physics.world.setBounds(0, 0, this.currentWidth, this.currentHeight);
  
            console.log(`Map shrunk to ${this.currentWidth}x${this.currentHeight}`);
          } else {
            console.log("Stopping MapShrinker");
            this.stop();
          }
        }, this.interval);
      }, this.delay);
    }
  
    shrinkLayer(layer) {
      // Convert pixel coordinates to tile coordinates
      const tileXMax = Math.ceil(this.currentWidth / this.tileWidth);
      const tileYMax = Math.ceil(this.currentHeight / this.tileHeight);
  
      // Shrink from top and bottom
      for (let x = -1; x < tileXMax; x++) {
        this.overlayTile(layer, x, -1); // Top row
        this.overlayTile(layer, x, tileYMax - 1); // Bottom row
      }
  
      // Shrink from left and right
      for (let y = -1; y < tileYMax; y++) {
        this.overlayTile(layer, -1, y); // Left column
        this.overlayTile(layer, tileXMax - 1, y); // Right column
      }
  
      // Update current dimensions
      this.currentWidth -= this.tileWidth * 2; // 32 pixels from each side
      this.currentHeight -= this.tileHeight * 2; // 32 pixels from each side
  
      // Adjust the world bounds
      layer.setCollisionByExclusion([-1], true);
    }
  
    overlayTile(layer, tileX, tileY) {
      const tile = layer.getTileAt(tileX, tileY);
  
    //   console.log(`Trying to overlay tile at (${tileX}, ${tileY}): `, tile);
  
      // Calculate the pixel position of the tile
      const pixelX = tileX * this.tileWidth;
      const pixelY = tileY * this.tileHeight;
  
      // Draw a red transparent rectangle at the calculated position
      this.redGraphics.fillRect(pixelX, pixelY, this.tileWidth, this.tileHeight);
    }

    reset() {
        console.log("MapShrinker reset called");
        this.stop();
        this.currentWidth = 3840;
        this.currentHeight = 2560;
        this.redGraphics.clear(); // Clear the red overlay
        this.scene.physics.world.setBounds(0, 0, this.currentWidth, this.currentHeight);
    
        // Optionally, you can reset the map layer to its original state if needed
        const layer = this.scene.mapShrink;
        layer.setCollisionByExclusion([-1], true);
      }
  
    stop() {
      console.log("MapShrinker stop called");
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  }
  