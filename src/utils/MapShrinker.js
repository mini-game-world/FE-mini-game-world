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
  
      this.redGraphics = this.scene.add.graphics();
      this.redGraphics.fillStyle(0xff0000, 0.5);
      this.redGraphics.setDepth(10); 
  
    }
  
    start() {
      console.log("MapShrinker start called");
      setTimeout(() => {
        this.timer = setInterval(() => {
          const layer = this.scene.mapShrink;
  
          if (this.currentWidth > this.minWidth && this.currentHeight > this.minHeight) {
            this.shrinkLayer(layer);
  
            this.scene.physics.world.setBounds(0, 0, this.currentWidth, this.currentHeight);
  
          } else {
            this.stop();
          }
        }, this.interval);
      }, this.delay);
    }
  
    shrinkLayer(layer) {
      const tileXMax = Math.ceil(this.currentWidth / this.tileWidth);
      const tileYMax = Math.ceil(this.currentHeight / this.tileHeight);
  
      for (let x = -1; x < tileXMax; x++) {
        this.overlayTile(layer, x, -1); 
        this.overlayTile(layer, x, tileYMax - 1); 
      }
  
      for (let y = -1; y < tileYMax; y++) {
        this.overlayTile(layer, -1, y); 
        this.overlayTile(layer, tileXMax - 1, y); 
      }
  
      this.currentWidth -= this.tileWidth * 2; 
      this.currentHeight -= this.tileHeight * 2; 
  
      layer.setCollisionByExclusion([-1], true);
    }
  
    overlayTile(layer, tileX, tileY) {
      const tile = layer.getTileAt(tileX, tileY);
  
      const pixelX = tileX * this.tileWidth;
      const pixelY = tileY * this.tileHeight;
  
      this.redGraphics.fillRect(pixelX, pixelY, this.tileWidth, this.tileHeight);
    }

    reset() {
        console.log("MapShrinker reset called");
        this.stop();
        this.currentWidth = 3840;
        this.currentHeight = 2560;
        this.redGraphics.clear(); 
        this.scene.physics.world.setBounds(0, 0, this.currentWidth, this.currentHeight);
    
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
  