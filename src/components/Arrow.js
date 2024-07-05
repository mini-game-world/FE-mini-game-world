import Phaser from "phaser";

class Arrow extends Phaser.GameObjects.Image {
  constructor(scene, player) {
    super(scene, player.x, player.y - 180, "arrow"); // 'arrow' is the texture key for the arrow image
    this.scene = scene;
    this.player = player;

    this.scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(32);
    this.setScale(0.1);

    this.updatePosition();
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 180);
  }

  destroy() {
    super.destroy();
  }
}

export default Arrow;
