class CollisionCheckerManager {
  constructor() {
    this.collisionAreas = [
      // collisionAreasPart1
      { x1: 544, y1: 640, x2: 800, y2: 864 },
      { x1: 864, y1: 640, x2: 1760, y2: 640 },
      { x1: 896, y1: 704, x2: 1728, y2: 832 },
      { x1: 928, y1: 896, x2: 1056, y2: 864 },
      { x1: 544, y1: 1120, x2: 800, y2: 1536 },
      { x1: 608, y1: 1600, x2: 800, y2: 1600 },
      { x1: 864, y1: 1184, x2: 928, y2: 1184 },
      { x1: 800, y1: 1248, x2: 928, y2: 1344 },
      { x1: 800, y1: 1408, x2: 1088, y2: 1600 },
      { x1: 160, y1: 1536, x2: 288, y2: 1600 },
      { x1: 416, y1: 1664, x2: 480, y2: 1664 },
      { x1: 1280, y1: 1408, x2: 1600, y2: 1600 },
      { x1: 1824, y1: 1120, x2: 2080, y2: 1344 },
      { x1: 1792, y1: 1408, x2: 2080, y2: 1536 },
      { x1: 1792, y1: 1536, x2: 2016, y2: 1606 },
      { x1: 1824, y1: 896, x2: 2080, y2: 864 },
      // collisionAreasPart2
      { x1: 1824, y1: 640, x2: 2816, y2: 640 },
      { x1: 2080, y1: 896, x2: 2560, y2: 896 },
      { x1: 2560, y1: 896, x2: 2784, y2: 1120 },
      { x1: 2560, y1: 1376, x2: 2784, y2: 1376 },
      { x1: 2560, y1: 1632, x2: 2784, y2: 1760 },
      { x1: 2592, y1: 1824, x2: 2784, y2: 1792 },
      { x1: 2624, y1: 1856, x2: 2784, y2: 1824 },
      { x1: 2656, y1: 1888, x2: 2784, y2: 1856 },
      { x1: 2784, y1: 1664, x2: 3104, y2: 1856 },
      { x1: 3040, y1: 768, x2: 3232, y2: 736 },
      { x1: 3008, y1: 800, x2: 3232, y2: 768 },
      { x1: 2976, y1: 832, x2: 3232, y2: 800 },
      { x1: 2944, y1: 864, x2: 3232, y2: 960 },
      { x1: 2944, y1: 1024, x2: 3200, y2: 992 },
      { x1: 3424, y1: 768, x2: 3648, y2: 768 },
      { x1: 3424, y1: 832, x2: 3712, y2: 960 },
      { x1: 3456, y1: 1024, x2: 3712, y2: 992 },
      { x1: 2944, y1: 1248, x2: 3200, y2: 1216 },
      { x1: 2944, y1: 1280, x2: 3712, y2: 1376 },
      { x1: 2944, y1: 1440, x2: 3680, y2: 1408 },
      { x1: 3008, y1: 1472, x2: 3648, y2: 1440 },
      { x1: 3008, y1: 1504, x2: 3616, y2: 1472 },
      { x1: 3456, y1: 1248, x2: 3712, y2: 1216 },
      { x1: 3552, y1: 1664, x2: 3840, y2: 1856 },
      // collisionAreasPart3
      { x1: 320, y1: 2112, x2: 1920, y2: 2336 },
      { x1: 320, y1: 2560, x2: 1920, y2: 2816 },
      { x1: 2624, y1: 2528, x2: 2880, y2: 2784 },
      { x1: 2848, y1: 3136, x2: 3104, y2: 3136 },
      { x1: 3104, y1: 2208, x2: 3360, y2: 2400 },
      { x1: 3296, y1: 2656, x2: 3552, y2: 2912 },
      { x1: 3648, y1: 2240, x2: 3840, y2: 2496 },
      { x1: 3712, y1: 3040, x2: 3840, y2: 3136 },
    ];

    this.safePositions = [
      { x: 1280, y: 1120 },
      { x: 2880, y: 1280 },
      { x: 2240, y: 2560 },
    ];
  }

  checkCollisionAndMove(player) {
    if (player.isDead) return;

    const safePosition = this.getSafePosition(player);
    if (safePosition && player.hitBox) {
      player.hitBox.setPosition(safePosition.x, safePosition.y);
    }
  }

  getSafePosition(player) {
    const { collisionAreas, safePositions } = this;

    for (let i = 0; i < collisionAreas.length; i++) {
      if (this.isInCollisionArea(player, collisionAreas[i])) {
        const areaIndex = i < 16 ? 0 : i < 41 ? 1 : 2;
        return safePositions[areaIndex];
      }
    }
    return null;
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

export default CollisionCheckerManager;
