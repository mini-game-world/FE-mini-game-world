import Phaser from "phaser";

class NickName extends Phaser.GameObjects.Text {
  constructor(scene, player, text) {
    super(scene, player.x, player.y + 50, text, {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center',
      font: '12px 배달의민족 주아 OTF',
    });
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.setDepth(40);

    this.scene.events.on('update', this.updatePosition, this);
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y + 50);
  }

  destroy() {
    this.scene.events.off('update', this.updatePosition, this);
    super.destroy();
  }
}

export default NickName;
