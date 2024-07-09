class ItemEffect {
  constructor(gameScene, player, item) {
    this.gameScene = gameScene;
    this.player = player;
    this.item = item;
  }

  applyEffect() {
    switch (this.item) {
      case 0:
        this.increaseSpeed();
        break;
      case 1:
        this.hidePlayer();
        break;
      case 2:
        this.increaseScale();
        break;
      default:
        break;
    }
    this.player.addStatusIcon(this.item); // 아이콘 추가
  }

  increaseSpeed() {
    if (this.player.player.isSelfInitiated) {
      this.player.speed = 900;
      this.gameScene.time.delayedCall(5000, () => {
        this.player.speed = 600; // 5초 후 원래 속도로 복구
      });
    }
  }

  hidePlayer() {
    if (this.player.player.isSelfInitiated) {
      // Todo
    } else {
      this.player.setAlpha(0);
      this.gameScene.time.delayedCall(5000, () => {
        this.player.setAlpha(1);
      });
    }
  }

  increaseScale() {
    this.player.setScale(2);
    this.gameScene.time.delayedCall(5000, () => {
      this.player.setScale(1); // 5초 후 원래 크기로 복구
    });
  }
}

export default ItemEffect;
