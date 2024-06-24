import Phaser from "phaser";

class Nickname extends Phaser.GameObjects.Text {
  constructor(scene, player, text) {
    super(scene, player.x, player.y + 50, text, {
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center'
    });
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    // this.setOrigin(0.5, 0.5);
    this.setDepth(31); // Ensure the nickname is above the player sprite

    // Update position on each frame
    this.scene.events.on('update', this.updatePosition, this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y + 50); // Adjust the Y offset as needed
  }

  destroy() {
    this.scene.events.off('update', this.updatePosition, this);
    super.destroy();
  }
}

export default Nickname;
