import Phaser from "phaser";
import Explosion from "./Explosion";

class Bomb extends Phaser.GameObjects.Sprite {
  constructor(scene, player) {
    super(scene, player.x, player.y - 10, "bomb");
    this.scene = scene;
    this.player = player;
    this.isSelfInitiated = this.player.isSelfInitiated;

    this.scene.add.existing(this);

    if (this.isSelfInitiated) {
      this.timerSound = this.scene.sound.add("timer_sound");
      this.timerSound.play();
    }

    this.scale = 0.5;
    //this.setOrigin(0.5, 1); // Adjust the origin to be above the player's head
    this.setDepth(31); // Ensure the bomb is above the player sprite

    this.createAnimations();
    this.play("bomb");

    // Update position on each frame
    this.scene.events.on("update", this.updatePosition, this);
  }

  createAnimations() {
    // 폭탄 애니메이션 정의
    this.scene.anims.create({
      key: "bomb",
      frames: this.scene.anims.generateFrameNumbers("bomb"),
      frameRate: 5,
      repeat: -1,
    });
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
  }

  explode() {
    new Explosion(this.scene, this.x, this.y, this.isSelfInitiated);
    this.destroy();
  }

  destroy() {
    this.scene.events.off("update", this.updatePosition, this);
    this.stopSound();
    super.destroy();
  }

  stopSound() {
    if (this.timerSound) {
      this.timerSound.stop();
    }
  }
}

export default Bomb;
