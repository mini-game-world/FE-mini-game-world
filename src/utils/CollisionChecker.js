class CollisionChecker {
    constructor() {
      this.collisionAreas = [];
  
      this.collisionAreasPart1 = [
        { x1: 544, y1: 0, x2: 800, y2: 224 },
        { x1: 864, y1: 0, x2: 1760, y2: 0 },
        { x1: 896, y1: 64, x2: 1728, y2: 192 },
        { x1: 928, y1: 256, x2: 1056, y2: 224 },
        { x1: 544, y1: 480, x2: 800, y2: 896 },
        { x1: 608, y1: 960, x2: 800, y2: 960 },
        { x1: 864, y1: 544, x2: 928, y2: 544 },
        { x1: 800, y1: 608, x2: 928, y2: 704 },
        { x1: 800, y1: 768, x2: 1088, y2: 960 },
        { x1: 160, y1: 896, x2: 288, y2: 960 },
        { x1: 416, y1: 1024, x2: 480, y2: 1024 },
        { x1: 1280, y1: 768, x2: 1600, y2: 960 },
        { x1: 1824, y1: 480, x2: 2080, y2: 704 },
        { x1: 1792, y1: 768, x2: 2080, y2: 896 },
        { x1: 1792, y1: 896, x2: 2016, y2: 966 },
        { x1: 1824, y1: 256, x2: 2080, y2: 224 },
      ];
  
      this.collisionAreasPart2 = [
        { x1: 1824, y1: 0, x2: 2816, y2: 0 },
        { x1: 2080, y1: 256, x2: 2560, y2: 256 },
        { x1: 2560, y1: 256, x2: 2784, y2: 480 },
        { x1: 2560, y1: 736, x2: 2784, y2: 736 },
        { x1: 2560, y1: 992, x2: 2784, y2: 1120 },
        { x1: 2592, y1: 1184, x2: 2784, y2: 1152 },
        { x1: 2624, y1: 1216, x2: 2784, y2: 1184 },
        { x1: 2656, y1: 1248, x2: 2784, y2: 1216 },
        { x1: 2784, y1: 1024, x2: 3104, y2: 1216 },
        { x1: 3040, y1: 128, x2: 3232, y2: 96 },
        { x1: 3008, y1: 160, x2: 3232, y2: 128 },
        { x1: 2976, y1: 192, x2: 3232, y2: 160 },
        { x1: 2944, y1: 224, x2: 3232, y2: 320 },
        { x1: 2944, y1: 384, x2: 3200, y2: 352 },
        { x1: 3424, y1: 128, x2: 3648, y2: 128 },
        { x1: 3424, y1: 192, x2: 3712, y2: 320 },
        { x1: 3456, y1: 384, x2: 3712, y2: 352 },
        { x1: 2944, y1: 608, x2: 3200, y2: 576 },
        { x1: 2944, y1: 640, x2: 3712, y2: 736 },
        { x1: 2944, y1: 800, x2: 3680, y2: 768 },
        { x1: 3008, y1: 832, x2: 3648, y2: 800 },
        { x1: 3008, y1: 864, x2: 3616, y2: 832 },
        { x1: 3456, y1: 608, x2: 3712, y2: 576 },
        { x1: 3552, y1: 1024, x2: 3840, y2: 1216 },
      ];
  
      this.collisionAreasPart3 = [
        { x1: 320, y1: 1472, x2: 1920, y2: 1696 },
        { x1: 320, y1: 1920, x2: 1920, y2: 2176 },
        { x1: 2624, y1: 1888, x2: 2880, y2: 2144 },
        { x1: 2848, y1: 2496, x2: 3104, y2: 2496 },
        { x1: 3104, y1: 1568, x2: 3360, y2: 1760 },
        { x1: 3296, y1: 2016, x2: 3552, y2: 2272 },
        { x1: 3648, y1: 1600, x2: 3840, y2: 1856 },
        { x1: 3712, y1: 2400, x2: 3840, y2: 2496 },
      ];
  
      this.safePositions = [
        { x: 1280, y: 480 },
        { x: 2880, y: 640 },
        { x: 2240, y: 1920 },
      ];
    }
  
    checkCollisionAndMove(player) {
      if (player.isDead) return;
      let safePosition = null;
  
      for (const area of this.collisionAreasPart1) {
        if (this.isInCollisionArea(player, area)) {
          safePosition = this.safePositions[0];
          break;
        }
      }
  
      if (!safePosition) {
        for (const area of this.collisionAreasPart2) {
          if (this.isInCollisionArea(player, area)) {
            safePosition = this.safePositions[1];
            break;
          }
        }
      }
  
      if (!safePosition) {
        for (const area of this.collisionAreasPart3) {
          if (this.isInCollisionArea(player, area)) {
            safePosition = this.safePositions[2];
            break;
          }
        }
      }
  
      if (safePosition) {
        console.log("Moving player to safe position:", safePosition);
        if (player.hitBox) {
          player.hitBox.setPosition(safePosition.x, safePosition.y);
        }
      }
    }
  
    isInCollisionArea(player, area) {
        const playerX = player.hitBox ? player.hitBox.x : player.x;
        const playerY = player.hitBox ? player.hitBox.y : player.y;
    
        return (
          playerX > area.x1 &&
          playerX < area.x2 &&
          playerY > area.y1 &&
          playerY < area.y2
        );
      }
  }
  
  export default CollisionChecker;