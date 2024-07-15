import Phaser from "phaser";

class BodyExplosion extends Phaser.GameObjects.Sprite {
  constructor(scene, player, container) {
    super(scene, player.x, player.y, "BodyExplosion");
    this.scene = scene;
    this.player = player;
    this.container = container;
    this.isSelfInitiated = this.player.isSelfInitiated;

    this.scene.add.existing(this);
    this.container.add(this);

    this.setScale(1.5);
    this.setOrigin(0.5, 1);
    this.setDepth(32);

    this.createAnimations();
    this.play("BodyExplosion");

    this.updatePosition();

    this.on("animationcomplete", () => {
      this.destroy();
    });
  }

  createAnimations() {
    this.scene.anims.create({
      key: "BodyExplosion",
      frames: this.scene.anims.generateFrameNumbers("BodyExplosion"),
      frameRate: 15,
      repeat: 0,
    });
  }

  updatePosition() {
    this.setPosition(this.player.x + 25, this.player.y + 150); // Adjust the Y offset as needed
  }
}

export default BodyExplosion;
