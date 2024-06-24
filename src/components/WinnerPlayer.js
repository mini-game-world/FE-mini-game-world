import Phaser from "phaser";

class WinnerPlayer extends Phaser.GameObjects.Text {
  constructor(scene, player, nickname) {
    super(scene, player.x, player.y - 200, `최종 우승자!! ${nickname}`, {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
    });
    this.scene = scene;
    this.player = player;
    this.scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDepth(100); // Ensure the nickname is above the player sprite

    // Update position on each frame
    this.scene.events.on('update', this.updatePosition, this);
  }
  
  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 200); // Adjust the Y offset as needed
  }

  destroy() {
    this.scene.events.off('update', this.updatePosition, this);
    super.destroy();
  }
}

export default WinnerPlayer;
