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
    } else {
    }
  }

  static applyItemEffect(scene, playerId, itemId) {
    const player = scene.players[playerId];
    if (!player) {
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
        scene.activeEffects[playerId].speed = originalSpeed;
        player.speed = 800; // 속도 증가

        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].speed) {
            player.speed = originalSpeed; // 원래 속도로 복구
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
            if(!player.isDead) player.setAlpha(originalAlpha);
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
  }

  static clearEffects(scene) {
    if (!scene.activeEffects) {
      return;
    }
    for (const playerId in scene.activeEffects) {
      const player = scene.players[playerId];
      if (!player) {
        continue;
      }
  
      const effects = scene.activeEffects[playerId];
  
      if (effects.speed) {
        player.speed = 600;
      }
  
      if (effects.alpha !== undefined) {
        if(!player.isDead) player.setAlpha(effects.alpha);
      }
  
      if (effects.scale) {
        player.setScale(effects.scale.x, effects.scale.y);
      }
    }
  
    scene.activeEffects = {};
  }
  
}

export default Item;