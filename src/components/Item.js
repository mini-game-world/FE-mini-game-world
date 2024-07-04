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

    if (!scene.activeEffects) {
      scene.activeEffects = {};
    }

    if (!scene.activeEffects[playerId]) {
      scene.activeEffects[playerId] = {};
    }

    switch (itemId) {
      case 0:
        const originalSpeed = player.speed; 
        console.log("====",player.speed,"====")
        scene.activeEffects[playerId].speed = originalSpeed;
        player.speed = 800; // 속도 증가
        console.log(`Increased speed for player ${playerId}`);
        console.log("====",player.speed,"====")

        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].speed) {
            player.speed = originalSpeed; // 원래 속도로 복구
            console.log(`Restored original speed for player ${playerId}`);
            delete scene.activeEffects[playerId].speed;
            if (Object.keys(scene.activeEffects[playerId]).length === 0) {
              delete scene.activeEffects[playerId];
            }
          }
        }, 5000);
        break;
      case 1:
        const originalAlpha = player.alpha;
        scene.activeEffects[playerId].alpha = originalAlpha;
        player.setAlpha(0);
        console.log(`Set opacity to 0 for player ${playerId}`);
  
        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].alpha !== undefined) {
            player.setAlpha(originalAlpha);
            console.log(`Restored opacity for player ${playerId}`);
            delete scene.activeEffects[playerId].alpha;
            if (Object.keys(scene.activeEffects[playerId]).length === 0) {
              delete scene.activeEffects[playerId];
            }
          }
        }, 5000);
        break;
      case 2:
        const originalScaleX = player.scaleX;
        const originalScaleY = player.scaleY;
        scene.activeEffects[playerId].scale = { x: originalScaleX, y: originalScaleY };
        player.setScale(originalScaleX * 1.5, originalScaleY * 1.5);
        console.log(`Scaled player ${playerId} by 1.5`);
  
        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].scale) {
            player.setScale(originalScaleX, originalScaleY);
            delete scene.activeEffects[playerId].scale;
            if (Object.keys(scene.activeEffects[playerId]).length === 0) {
              delete scene.activeEffects[playerId];
            }
          }
        }, 5000);
        break;
    }
  }

  static clearAllItems(scene) {
    scene.items.forEach(item => {
      item.destroy();
    });
    scene.items = [];
    console.log("모든 아이템 삭제됨");
  }

  static clearEffects(scene) {
    console.log("clearEffects");
    console.log(scene.activeEffects);
    if (!scene.activeEffects) {
      return;
    }
    for (const playerId in scene.activeEffects) {
      const player = scene.players[playerId];
      console.log(player.speed);
      if (!player) {
        console.log(`Player with ID ${playerId} not found`);
        continue;
      }
  
      const effects = scene.activeEffects[playerId];
  
      if (effects.speed) {
        player.speed = 600;
      }
  
      if (effects.alpha !== undefined) {
        player.setAlpha(effects.alpha);
      }
  
      if (effects.scale) {
        player.setScale(effects.scale.x, effects.scale.y);
      }
    }
  
    scene.activeEffects = {};
    console.log('All effects removed');
  }
  
}

export default Item;