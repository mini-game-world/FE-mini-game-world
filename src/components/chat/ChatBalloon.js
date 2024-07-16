import Phaser from "phaser";

export default class ChatBalloon extends Phaser.GameObjects.Container {
  constructor(scene, player) {
    super(scene, player.x, player.y - 100);
    this.scene = scene;
    this.player = player;
    this.hideTimer = null;

    this.setDepth(31).setVisible(false);

    this.balloonGraphics = this.scene.add.graphics();
    this.chatText = this.scene.add
      .text(0, 0, "", {
        fontSize: "24px",
        fill: "#000000",
        fontFamily: "BMJUA",
        padding: { x: 10, y: 5 },
        align: "center",
        wordWrap: { width: 280, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    this.add(this.balloonGraphics);
    this.add(this.chatText);

    scene.add.existing(this);
  }

  showChatMessage(message) {
    this.chatText.setText(message);

    const padding = 20;
    const balloonWidth = this.chatText.width + padding;
    const balloonHeight = this.chatText.height + padding + 10;

    this.balloonGraphics.clear();
    this.balloonGraphics.fillStyle(0xffffff, 1);
    this.balloonGraphics.fillRoundedRect(
      -balloonWidth / 2,
      -balloonHeight / 2,
      balloonWidth,
      balloonHeight - 10,
      15
    );
    this.balloonGraphics.fillTriangle(
      -10,
      balloonHeight / 2 - 10,
      10,
      balloonHeight / 2 - 10,
      0,
      balloonHeight / 2
    );

    this.setVisible(true);

    if (this.hideTimer) {
      this.hideTimer.remove(false);
    }

    this.hideTimer = this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.setVisible(false);
      },
      callbackScope: this,
    });
  }

  destroy() {
    if (this.hideTimer) {
      this.hideTimer.remove(false);
    }
    super.destroy();
  }
}
