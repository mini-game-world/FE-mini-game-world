export default class WinnerDisplay {
  constructor(scene) {
    this.scene = scene;
    this.winnerText = null;
  }

  showWinner(playerId, x, y) {
    if (this.winnerText) {
      this.winnerText.destroy();
    }

    this.winnerText = this.scene.add
      .text(x, y, `최종 우승자!! ${playerId}`, {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.scene.time.delayedCall(
      5000,
      () => {
        if (this.winnerText) {
          this.winnerText.destroy();
          this.winnerText = null;
        }
      },
      [],
      this.scene
    );
  }

  updatePosition(x, y) {
    if (this.winnerText) {
      this.winnerText.setPosition(x, y - 50);
    }
  }
}
