import Phaser from "phaser";

class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, player) {
    super(scene, player.x, player.y, "explosion");
    this.scene = scene;
    this.player = player;
    this.isSelfInitiated = this.player.isSelfInitiated;

    this.scene.add.existing(this);

    if (this.isSelfInitiated) {
      this.explosion_sound = scene.sound.add("explosion_sound", {
        volume: 0.2,
      });
      this.explosion_sound.play();
    }

    this.setScale(2.5);
    this.setOrigin(0.5, 1);
    this.setDepth(32);

    this.createAnimations();
    this.play("explode");

    this.updatePosition();

    // this.on("animationcomplete", () => {
    //   this.destroy();
    // });
  }

  createAnimations() {
    this.scene.anims.create({
      key: "explode",
      frames: this.scene.anims.generateFrameNumbers("explosion"),
      frameRate: 15,
      repeat: 0,
    });
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
  }
}

export default Explosion;
