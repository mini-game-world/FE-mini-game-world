class CollisionChecker {
    constructor() {
      this.collisionAreas = [];
  
      this.collisionAreasPart1 = [
        { x1: 864, y1: 640, x2: 1120, y2: 864 },
        { x1: 1184, y1: 640, x2: 2080, y2: 640 },
        { x1: 1216, y1: 704, x2: 2048, y2: 832 },
        { x1: 1248, y1: 896, x2: 1376, y2: 864 },
        { x1: 864, y1: 1120, x2: 1120, y2: 1536 },
        { x1: 928, y1: 1600, x2: 1120, y2: 1600 },
        { x1: 1184, y1: 1184, x2: 1248, y2: 1184 },
        { x1: 1120, y1: 1248, x2: 1248, y2: 1344 },
        { x1: 1120, y1: 1408, x2: 1408, y2: 1600 },
        { x1: 480, y1: 1536, x2: 608, y2: 1600 },
        { x1: 736, y1: 1664, x2: 800, y2: 1664 },
        { x1: 1600, y1: 1408, x2: 1920, y2: 1600 },
        { x1: 2144, y1: 1120, x2: 2400, y2: 1344 },
        { x1: 2112, y1: 1408, x2: 2400, y2: 1536 },
        { x1: 2112, y1: 1536, x2: 2336, y2: 1606 },
        { x1: 2144, y1: 896, x2: 2400, y2: 864 },
    ];
    
    this.collisionAreasPart2 = [
        { x1: 2144, y1: 640, x2: 3136, y2: 640 },
        { x1: 2400, y1: 896, x2: 2880, y2: 896 },
        { x1: 2880, y1: 896, x2: 3104, y2: 1120 },
        { x1: 2880, y1: 1376, x2: 3104, y2: 1376 },
        { x1: 2880, y1: 1632, x2: 3104, y2: 1760 },
        { x1: 2912, y1: 1824, x2: 3104, y2: 1792 },
        { x1: 2944, y1: 1856, x2: 3104, y2: 1824 },
        { x1: 2976, y1: 1888, x2: 3104, y2: 1856 },
        { x1: 3104, y1: 1664, x2: 3424, y2: 1856 },
        { x1: 3360, y1: 768, x2: 3552, y2: 736 },
        { x1: 3328, y1: 800, x2: 3552, y2: 768 },
        { x1: 3296, y1: 832, x2: 3552, y2: 800 },
        { x1: 3264, y1: 864, x2: 3552, y2: 960 },
        { x1: 3264, y1: 1024, x2: 3520, y2: 992 },
        { x1: 3744, y1: 768, x2: 3968, y2: 768 },
        { x1: 3744, y1: 832, x2: 4032, y2: 960 },
        { x1: 3776, y1: 1024, x2: 4032, y2: 992 },
        { x1: 3264, y1: 1248, x2: 3520, y2: 1216 },
        { x1: 3264, y1: 1280, x2: 4032, y2: 1376 },
        { x1: 3264, y1: 1440, x2: 4000, y2: 1408 },
        { x1: 3328, y1: 1472, x2: 3968, y2: 1440 },
        { x1: 3328, y1: 1504, x2: 3936, y2: 1472 },
        { x1: 3776, y1: 1248, x2: 4032, y2: 1216 },
        { x1: 3872, y1: 1664, x2: 4160, y2: 1856 },
    ];
    
    this.collisionAreasPart3 = [
        { x1: 640, y1: 2112, x2: 2240, y2: 2336 },
        { x1: 640, y1: 2560, x2: 2240, y2: 2816 },
        { x1: 2944, y1: 2528, x2: 3200, y2: 2784 },
        { x1: 3168, y1: 3136, x2: 3424, y2: 3136 },
        { x1: 3424, y1: 2208, x2: 3680, y2: 2400 },
        { x1: 3616, y1: 2656, x2: 3872, y2: 2912 },
        { x1: 3968, y1: 2240, x2: 4160, y2: 2496 },
        { x1: 4032, y1: 3040, x2: 4160, y2: 3136 },
    ];
  
      this.safePositions = [
        { x: 1600, y: 1120 },
        { x: 3200, y: 1280 },
        { x: 2560, y: 2560 },
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