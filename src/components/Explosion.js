import Phaser from "phaser";

class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, isSelfInitiated) {
    super(scene, x, y, "explosion");
    this.scene = scene;
    this.scene.add.existing(this);
    this.isSelfInitiated = isSelfInitiated;

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

    // UI 카메라에서 폭발 무시
    const uiCamera = this.scene.cameras.getCamera("UICamera");
    if (uiCamera) {
      uiCamera.ignore(this);
    }

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
