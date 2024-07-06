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

    if (player.itemIcons && player.itemIcons[itemId]) {
      player.itemIcons[itemId].destroy();
      delete player.itemIcons[itemId];
    }

    let itemIcon;

    switch (itemId) {
      case 0:
        const originalSpeed = 600;
        scene.activeEffects[playerId].speed = originalSpeed;
        player.speed = 800; 

        itemIcon = scene.add.image(player.x, player.y, 'item0').setScale(3);
        player.itemIcons = player.itemIcons || {};
        player.itemIcons[0] = itemIcon;
        scene.activeEffects[playerId].icon = itemIcon;

        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].speed !== undefined) {
            player.speed = originalSpeed; 
            if (player.itemIcons[0]) {
              player.itemIcons[0].destroy(); 
              delete player.itemIcons[0];
            }
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

        itemIcon = scene.add.image(player.x, player.y, 'item1').setScale(3);
        player.itemIcons = player.itemIcons || {};
        player.itemIcons[1] = itemIcon;
        scene.activeEffects[playerId].icon = itemIcon;

        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].alpha !== undefined) {
            if (!player.isDead) player.setAlpha(originalAlpha);
            if (player.isDead) player.setAlpha(0.3);
            if (player.itemIcons[1]) {
              player.itemIcons[1].destroy(); 
              delete player.itemIcons[1];
            }
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

        itemIcon = scene.add.image(player.x, player.y, 'item2').setScale(3);
        player.itemIcons = player.itemIcons || {};
        player.itemIcons[2] = itemIcon;
        scene.activeEffects[playerId].icon = itemIcon;

        setTimeout(() => {
          if (scene.activeEffects[playerId] && scene.activeEffects[playerId].scale) {
            player.setScale(originalScaleX, originalScaleY);
            if (player.itemIcons[2]) {
              player.itemIcons[2].destroy(); 
              delete player.itemIcons[2];
            }
            delete scene.activeEffects[playerId].scale;
            if (Object.keys(scene.activeEffects[playerId]).length === 0) {
              delete scene.activeEffects[playerId];
            }
          }
        }, 5000);
        break;
    }

    if (itemIcon) {
      itemIcon.setPosition(player.x, player.y);
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
        if (!player.isDead) player.setAlpha(effects.alpha);
        if (player.isDead) player.setAlpha(0.3);
      }
  
      if (effects.scale) {
        player.setScale(effects.scale.x, effects.scale.y);
      }

      if (player.itemIcons) {
        for (const itemId in player.itemIcons) {
          const itemIcon = player.itemIcons[itemId];
          if (itemIcon) {
            itemIcon.destroy();
            delete player.itemIcons[itemId];
          }
        }
      }
    }
  
    scene.activeEffects = {};
  }
}

export default Item;
