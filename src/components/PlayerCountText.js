class PlayerCountText {
  constructor(scene) {
    this.scene = scene;
    this.text = this.scene.add.text(0, 0, "", {
      fontSize: "80px",
      fill: "#ffffff",
      padding: { x: 10, y: 5 },
      fontFamily: "BMJUA",
    });

    this.text.setDepth(100);
    this.text.setScrollFactor(0);
    this.text.setOrigin(0, 0);
  }

  update(count) {
    this.text.setText(`접속자 수 : ${count}`);
  }
}

export default PlayerCountText;
