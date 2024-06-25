class PlayerCountText {
  constructor(scene, x, y, initialCount) {
    this.scene = scene;
    this.text = this.scene.add.text(x, y, `접속자 수 : ${initialCount}`, {
      fontSize: "24px",
      fill: "#ffffff",
      padding: { x: 10, y: 5 },
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
