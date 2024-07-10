import Phaser from "phaser";

class Nickname extends Phaser.GameObjects.Text {
  constructor(scene, player, text) {
    super(scene, player.x, player.y + player.height / 2, text, {
      fontSize: "28px",
      fill: "#ffffff",
      align: "center",
      fontFamily: "BMJUA",
      stroke: "#000000",
      strokeThickness: 4,
    });
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    this.setOrigin(0.5, -0.7);
    this.setDepth(40);
  }

  destroy() {
    super.destroy();
  }
}

export default Nickname;
