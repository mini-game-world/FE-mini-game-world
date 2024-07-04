import Phaser from "phaser";
import Player from "./Player";
import Nickname from "./Nickname";
import SocketManager from "../utils/SocketManager";

class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, info) {
    super(scene, x, y);
    this.scene = scene;
    this.player = new Player(scene, 0, 0, texture, info);
    this.nickname = new Nickname(scene, this.player, info.nickname);

    this.add(this.player);
    this.add(this.nickname);

    this.hitBox = this.scene.add.zone(
      this.x,
      this.y,
      this.player.width,
      this.player.height
    );
    this.scene.physics.world.enable(this.hitBox);
    this.hitBox.body.setCollideWorldBounds(true);

    this.scene.add.existing(this);
    this.setSize(this.player.width, this.player.height);
    this.setDepth(30);

    this.createInputKeyBoard();

    this.prevX = x;
    this.prevY = y;
  }

  createInputKeyBoard() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z, // 공격 키 추가
    });
  }

  getVelocity() {
    const speed = this.player.bomb ? 700 : 600;
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.up.isDown) velocityY = -speed;
    if (this.keys.down.isDown) velocityY = speed;
    if (this.keys.left.isDown) velocityX = -speed;
    if (this.keys.right.isDown) velocityX = speed;

    return { velocityX, velocityY };
  }

  update() {
    const { velocityX, velocityY } = this.getVelocity();
    this.hitBox.body.setVelocity(velocityX, velocityY);

    if (this.prevX !== this.x || this.prevY !== this.y) {
      this.prevX = this.x;
      this.prevY = this.y;
      SocketManager.emitPlayerMovement({ x: this.x, y: this.y });
    }

    this.player.update(); // 플레이어 업데이트
    this.nickname.updatePosition(); // 닉네임 위치 업데이트

    // 컨테이너 위치 업데이트
    this.setPosition(this.hitBox.x, this.hitBox.y);

    // 플레이어 애니메이션 처리
    if (velocityX !== 0 || velocityY !== 0) {
      this.player.anims.play(`move${this.player.avatar}`, true);
      this.player.setFlipX(velocityX > 0);
    } else {
      this.player.anims.play(`idle${this.player.avatar}`, true);
    }
  }

  moveTo(x, y) {
    const deltaX = x - this.hitBox.x;
    const deltaY = y - this.hitBox.y;

    this.scene.tweens.add({
      targets: this.hitBox,
      x: x,
      y: y,
      duration: 100,
      ease: "Linear",
      onUpdate: () => {
        this.setPosition(this.hitBox.x, this.hitBox.y);
        if (deltaX !== 0 || deltaY !== 0) {
          this.player.anims.play(`move${this.player.avatar}`, true);
          this.player.setFlipX(deltaX > 0);
        } else {
          this.player.anims.play(`idle${this.player.avatar}`, true);
        }
      },
      onComplete: () => {
        clearTimeout(this.player.idleTimeout);
        this.player.idleTimeout = setTimeout(() => {
          this.player.anims.play(`idle${this.player.avatar}`, true);
        }, 100);
      },
    });
  }
}

export default PlayerContainer;
