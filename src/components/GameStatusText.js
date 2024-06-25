class GameStatusText {
  constructor(scene) {
    this.scene = scene;
    this.text = this.scene.add
      .text(this.scene.cameras.main.width / 2, 50, "", {
        fontSize: "32px",
        color: "#ffffff",
        padding: { x: 10, y: 5 },
        align: "center",
        font: '32px 배달의민족 주아 OTF',
      })
      .setOrigin(0.5, 0.5);
    this.text.setAlpha(0); // Initially hidden
    this.text.setScrollFactor(0);
    this.text.setDepth(100);
  }

  showText(message) {
    this.text.setText(message);
    this.text.setAlpha(1);

    // Fade out after 2 seconds
    this.scene.tweens.add({
      targets: this.text,
      alpha: { from: 1, to: 0 },
      ease: "Cubic.easeOut",
      duration: 2000,
      delay: 2000,
    });
  }
}

export default GameStatusText;
