class GameStatusText {
  constructor(scene) {
    this.scene = scene;
    this.text = this.scene.add
      .text(this.scene.cameras.main.width / 2, 50, "", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    this.text.setAlpha(0); // Initially hidden
    this.text.setScrollFactor(0);
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
