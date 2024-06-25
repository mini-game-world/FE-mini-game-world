import Phaser from "phaser";

class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "explosion");
    this.scene = scene;
    this.scene.add.existing(this);

    this.explosion_sound = scene.sound.add("explosion_sound", { volume: 0.5 });
    this.explosion_sound.play();

    this.setScale(1.5);
    this.setDepth(32);

    this.createAnimations();
    this.play("explode");

    this.on("animationcomplete", () => {
      this.destroy();
    });
  }

  createAnimations() {
    this.scene.anims.create({
      key: "explode",
      frames: this.scene.anims.generateFrameNumbers("explosion"),
      frameRate: 15,
      repeat: 0,
    });
  }
}

export default Explosion;
