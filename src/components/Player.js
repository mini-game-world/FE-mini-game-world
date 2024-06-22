import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";

class Player {
  constructor(scene, x, y, texture, avatar) {
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

    this.avatar = avatar;
    this.createAnimations();
    this.sprite.anims.play(`idle${this.avatar}`, true);

    this.isAttacking = false; // 공격 상태를 추적

    this.prevX = x;
    this.prevY = y;
  }

  createAnimations() {
    this.scene.anims.create({
      key: `idle${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(`player${this.avatar}`),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `move${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(
        `player_move${this.avatar}`
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `attack${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(
        `player_attack${this.avatar}`
      ),
      frameRate: 12,
      repeat: 0,
    });

    // 공격 애니메이션이 완료될 때 콜백
    this.sprite.on("animationcomplete", (anim, frame) => {
      if (anim.key === `attack${this.avatar}`) {
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

    // Check if position has changed
    if (this.prevX !== this.sprite.x || this.prevY !== this.sprite.y) {
      this.prevX = this.sprite.x;
      this.prevY = this.sprite.y;
      // Emit position only when it has changed
      SocketManager.emitPlayerMove({ x: this.sprite.x, y: this.sprite.y });
    }

    if (this.keys.attack.isDown) {
      this.isAttacking = true;
      this.sprite.anims.play(`attack${this.avatar}`, true);
    } else if (velocityX !== 0 || velocityY !== 0) {
      this.sprite.anims.play(`move${this.avatar}`, true);
      this.sprite.setFlipX(velocityX > 0);
    } else {
      this.sprite.anims.play(`idle${this.avatar}`, true);
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
