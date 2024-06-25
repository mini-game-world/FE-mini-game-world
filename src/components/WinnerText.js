class WinnerText {
  constructor(scene) {
    this.scene = scene;
    this.winnerText = null;
  }

  showWinner(name) {
    if (this.winnerText) {
      this.winnerText.destroy();
    }

    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2 - 200;

    this.winnerText = this.scene.add
      .text(centerX, centerY, `최종 우승자!! ${name}`, {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
        font: '38px 배달의민족 주아 OTF',
      })
      .setDepth(100);

    this.winnerText.setScrollFactor(0);
    this.winnerText.setOrigin(0.5, 0);

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

  destroy() {
    this.scene.events.off("update", this.updatePosition, this);
    super.destroy();
  }
}

export default WinnerText;
