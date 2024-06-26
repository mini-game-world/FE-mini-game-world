import Phaser from "phaser";

class Nickname extends Phaser.GameObjects.Text {
  constructor(scene, player, text) {
    super(scene, player.x, player.y + 50, text, {
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center',
      fontFamily: 'Bazzi',
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.setDepth(40);

    this.scene.events.on('update', this.updatePosition, this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y + 50 * (this.player.scale + 0.8));
  }

  destroy() {
    this.scene.events.off('update', this.updatePosition, this);
    super.destroy();
  }
}

export default Nickname;
