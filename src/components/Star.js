import Phaser from "phaser";

class Star extends Phaser.GameObjects.Sprite {
  constructor(scene, player) {
    super(scene, player.x, player.y, "star");
    this.scene = scene;
    this.player = player;
    this.isSelfInitiated = this.player.isSelfInitiated;

    this.scene.add.existing(this);

    this.scale = 1.2;
    this.setOrigin(0.5, 0.8); // Adjust the origin to be above the player's head
    this.setDepth(31); // Ensure the bomb is above the player sprite

    this.createAnimations();
    this.play("stun_star");

    // Update position on each frame
    this.scene.events.on("update", this.updatePosition, this);

  }

  createAnimations() {
    // 별 애니메이션 정의
    this.anims.create({
        key: "stun_star",
        frames: this.anims.generateFrameNumbers("star"),
        frameRate: 20,
        repeat: -1,
        hideOnComplete: true,
      })
  }

  updatePosition() {
    this.setPosition(this.player.x, this.player.y - 50); // Adjust the Y offset as needed
  }

  destroy() {
    this.scene.events.off("update", this.updatePosition, this);
    super.destroy();
  }

}

export default Star;
