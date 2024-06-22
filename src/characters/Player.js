import Phaser from "phaser";

class Player {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z, // 공격 키 추가
    });

    this.createAnimations();
    this.isAttacking = false; // 공격 상태를 추적
  }

  createAnimations() {
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("player"),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "move",
      frames: this.scene.anims.generateFrameNumbers("player_move"),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("player_attack"),
      frameRate: 12,
      repeat: 0,
    });

    // 공격 애니메이션이 완료될 때 콜백
    this.sprite.on("animationcomplete", (anim, frame) => {
      if (anim.key === "attack") {
        this.isAttacking = false;
      }
    });
  }

  getVelocity() {
    const speed = 160;
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.up.isDown) velocityY = -speed;
    if (this.keys.down.isDown) velocityY = speed;
    if (this.keys.left.isDown) velocityX = -speed;
    if (this.keys.right.isDown) velocityX = speed;

    return { velocityX, velocityY };
  }

  update() {
    if (this.isAttacking) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    const { velocityX, velocityY } = this.getVelocity();
    this.sprite.setVelocity(velocityX, velocityY);

    if (this.keys.attack.isDown) {
      this.isAttacking = true;
      this.sprite.anims.play("attack", true);
    } else if (velocityX !== 0 || velocityY !== 0) {
      this.sprite.anims.play("move", true);
      this.sprite.setFlipX(velocityX > 0);
    } else {
      this.sprite.anims.play("idle", true);
    }
  }
  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }

  destroy() {
    this.sprite.destroy();
  }
}

export default Player;
