import Phaser from "phaser";

class Bomb extends Phaser.GameObjects.Image {
  constructor(scene, player) {
    super(scene, player.x, player.y - 50, 'bomb');
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    this.setOrigin(0.5, 1); // Adjust the origin to be above the player's head
    this.setDepth(31); // Ensure the bomb is above the player sprite

    // Update position on each frame
    this.scene.events.on('update', this.updatePosition, this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
  }

  destroy() {
    this.scene.events.off('update', this.updatePosition, this);
    super.destroy();
  }
}

export default Bomb;
