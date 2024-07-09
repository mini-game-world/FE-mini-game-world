class RankText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(
      scene,
      3100,
      450,
      "",
      {
        fontSize: "40px",
        fill: "#ffffff",
        padding: { x: 10, y: 5 },
        fontFamily: "BMJUA",
        stroke: "#000000",
        strokeThickness: 10,
      }
    );
    this.scene = scene;
    this.setDepth(100);
    this.setScrollFactor(0);
    this.setOrigin(1, 0);
    this.scene.add.existing(this);

    this.secondLine = new Phaser.GameObjects.Text(
      scene,
      3100, 
      500, 
      "",
      {
        fontSize: "40px",
        fill: "#ffffff",
        padding: { x: 10, y: 5 },
        fontFamily: "BMJUA",
        stroke: "#000000",
        strokeThickness: 10,
      }
    );
    this.secondLine.setDepth(100);
    this.secondLine.setScrollFactor(0);
    this.secondLine.setOrigin(1, 0);
    this.scene.add.existing(this.secondLine);
  }

  showBombRank(nickname, count) {
    this.setAlpha(1);
    this.setText(`폭탄돌리기왕 ${nickname} ${count}회`);
  }

  showHitRank(nickname, count) {
    this.secondLine.setAlpha(1);
    this.secondLine.setText(`스트라이커 ${nickname} ${count}회`);
  }

  clearText() {
    this.setAlpha(0);
    this.secondLine.setAlpha(0);
  }
}

export default RankText;
