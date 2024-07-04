class Item extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setScale(3);
  }

  static destroyItem(scene, x, y) {
    const item = scene.items.find(item => item.x === x && item.y === y);
    if (item) {
      item.destroy();
      scene.items = scene.items.filter(i => i !== item);
      console.log(`아이템 (${x}, ${y}) 삭제`);
    } else {
      console.log(`(${x}, ${y}) 아이템 없어`);
    }
  }

  static applyItemEffect(scene, playerId, itemId) {
    const player = scene.players[playerId];
    if (!player) {
      console.log(`Player with ID ${playerId} not found`);
      return;
    }
    console.log(itemId);
    switch (itemId) {
      case 0:
        player.increaseSpeed();
        scene.time.delayedCall(5000, () => player.resetSpeed(), [], player);
        break;
      case 1:
        player.becomeTransparent();
        scene.time.delayedCall(5000, () => player.resetTransparency(), [], player);
        break;
      case 2:
        player.increaseSize();
        scene.time.delayedCall(5000, () => player.resetSize(), [], player);
        break;
      default:
        console.log(`Unknown item ID: ${itemId}`);
    }
  }

  static clearAllItems(scene) {
    scene.items.forEach(item => {
      item.destroy();
    });
    scene.items = [];
    console.log("모든 아이템 삭제됨");
  }
}

export default Item;
