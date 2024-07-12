import Phaser from "phaser";

class Bang extends Phaser.GameObjects.Sprite {
  constructor(scene, player, container) {
    super(scene, player.x, player.y, "bang");
    this.scene = scene;
    this.player = player;
    this.container = container;

    this.scene.add.existing(this);
    this.container.add(this);

    this.scale = 0.7;
    this.setOrigin(0, 0.8); // Adjust the origin to be above the player's head
    this.setDepth(31); // Ensure the bomb is above the player sprite

    this.updatePosition();
    this.scene.time.delayedCall(1000, this.destroy, [], this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
  }

  destroy() {
    super.destroy();
  }
}

export default Bang;
