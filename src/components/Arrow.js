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

    // Update the position of the arrow to follow the player
    scene.events.on("update", this.updatePosition, this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 180);
  }

  destroy() {
    this.scene.events.off("update", this.updatePosition, this);
    super.destroy();
  }
}

export default Arrow;
