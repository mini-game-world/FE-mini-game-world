class ItemEffect {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
  }

  applyEffect(acquire_player, itemNumber) {
    if (this.player === acquire_player) {
      this.acquireSound = this.scene.sound.add("acquire_sound", {
        volume: 0.2,
      });
      this.acquireSound.play();
    }
    switch (itemNumber) {
      case 0:
        this.increaseMySpeedUPAndScaleDown(acquire_player);
        acquire_player.addStatusIcon(itemNumber, 5000);
        break;
      case 1:
        this.hidePlayer(acquire_player);
        acquire_player.addStatusIcon(itemNumber, 3000);
        break;
      case 2:
        this.increaseMySpeedDownAndScaleUp(acquire_player);
        acquire_player.addStatusIcon(itemNumber, 5000);
        break;
      case 3:
        this.reverseDirection(acquire_player);
        acquire_player.addStatusIcon(itemNumber, 3000);
        break;
      default:
        break;
    }
  }

  increaseMySpeedUPAndScaleDown(acquire_player) {
    if (this.player === acquire_player) {
      this.player.speed = 800;
      this.player.setScale(0.5);
      this.scene.time.delayedCall(5000, () => {
        this.player.setScale(1);
        this.player.speed = 600;
      });
    } else {
      acquire_player.setScale(0.5);
      this.scene.time.delayedCall(5000, () => {
        acquire_player.setScale(1);
      });
    }
  }

  hidePlayer(acquire_player) {
    if (this.player === acquire_player) {
      this.player.setAlpha(0.7);
      this.scene.time.delayedCall(3000, () => {
        this.player.setAlpha(1);
      });
    } else {
      acquire_player.setAlpha(0);
      this.scene.time.delayedCall(3000, () => {
        acquire_player.setAlpha(1);
      });
    }
  }

  increaseMySpeedDownAndScaleUp(acquire_player) {
    if (acquire_player.player.isSelfInitiated) {
      this.player.speed = 400;
      this.player.setScale(2);
      this.scene.time.delayedCall(5000, () => {
        this.player.setScale(1);
        this.player.speed = 600;
      });
    } else {
      acquire_player.setScale(2);
      this.scene.time.delayedCall(5000, () => {
        acquire_player.setScale(1);
      });
    }
  }

  reverseDirection(acquire_player) {
    if (this.player === acquire_player) {
      this.player.isReversed = true;
      this.scene.time.delayedCall(3000, () => {
        this.player.isReversed = false; // 5초 후 원래 상태로 복구
      });
    }
  }

  // increaseOthersSpeedUPAndScaleDown(acquire_player, players) {
  //   Object.keys(players).forEach((id) => {
  //     if (players[id] !== acquire_player) {
  //       players[id].setScale(0.5);
  //       this.scene.time.delayedCall(5000, () => {
  //         players[id].setScale(1);
  //       });
  //     }
  //   });

  //   if (this.player !== acquire_player) {
  //     this.player.speed = 800;
  //     this.scene.time.delayedCall(5000, () => {
  //       this.player.speed = 600;
  //     });
  //   }
  // }
  // increaseOthersSpeedDownAndScaleUp(acquire_player, players) {
  //   Object.keys(players).forEach((id) => {
  //     if (players[id] !== acquire_player) {
  //       players[id].setScale(2);
  //       this.scene.time.delayedCall(5000, () => {
  //         players[id].setScale(1);
  //       });
  //     }
  //   });

  //   if (this.player !== acquire_player) {
  //     this.player.speed = 400;
  //     this.scene.time.delayedCall(5000, () => {
  //       this.player.speed = 600;
  //     });
  //   }
  // }
}

export default ItemEffect;
