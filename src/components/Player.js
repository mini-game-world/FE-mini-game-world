import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, avatar) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.avatar = avatar;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z, // 공격 키 추가
    });

    this.createAnimations();
    this.anims.play(`idle${this.avatar}`, true);

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
    this.on("animationcomplete", (anim, frame) => {
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

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.isAttacking) {
      this.setVelocity(0, 0);
      return;
    }

    const { velocityX, velocityY } = this.getVelocity();
    this.setVelocity(velocityX, velocityY);

    // Check if position has changed
    if (this.prevX !== this.x || this.prevY !== this.y) {
      this.prevX = this.x;
      this.prevY = this.y;
      // Emit position only when it has changed
      SocketManager.emitPlayerMove({ x: this.x, y: this.y });
    }

    if (this.keys.attack.isDown) {
      this.isAttacking = true;
      this.anims.play(`attack${this.avatar}`, true);
    } else if (velocityX !== 0 || velocityY !== 0) {
      this.anims.play(`move${this.avatar}`, true);
      this.setFlipX(velocityX > 0);
    } else {
      this.anims.play(`idle${this.avatar}`, true);
    }
  }

  setPosition(x, y) {
    super.setPosition(x, y);
  }

  destroy() {
    super.destroy();
  }
}

export default Player;
