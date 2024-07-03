class PlayerCountText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(
      scene,
      scene.cameras.main.width / 2 -
        scene.cameras.main.width / 2 / scene.cameras.main.zoom,
      scene.cameras.main.height / 2 -
        scene.cameras.main.height / 2 / scene.cameras.main.zoom,
      "",
      {
        fontSize: "80px",
        fill: "#ffffff",
        padding: { x: 10, y: 5 },
        fontFamily: "BMJUA",
      }
    );
    this.scene = scene;
    this.setDepth(100);
    this.setScrollFactor(0);
    this.setOrigin(0, 0);
    this.scene.add.existing(this);
  }

  update(count) {
    this.setText(`접속자 수 : ${count}`);
  }
}

export default PlayerCountText;
