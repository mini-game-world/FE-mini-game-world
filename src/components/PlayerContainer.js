import Phaser from "phaser";
import Player from "./Player";
import Nickname from "./Nickname";
import SocketManager from "../utils/SocketManager";
import Claw from "./Claw";
import Star from "./Star";
import Arrow from "./Arrow";
import ChatBalloon from "./ChatBalloon";
import Bomb from "./Bomb";
import Explosion from "./Explosion";

class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, info) {
    super(scene, x, y);
    this.scene = scene;
    this.player = new Player(scene, 0, 0, texture, info);
    this.nickname = new Nickname(scene, this.player, info.nickname);
    this.chatBalloon = new ChatBalloon(this.scene, this.player);

    this.add(this.player);
    this.add(this.nickname);
    this.add(this.chatBalloon);

    if (info.isSelfInitiated) {
      this.arrow = new Arrow(this.scene, this.player);
      this.add(this.arrow);
    }

    const hitboxWidth = this.player.width / 4;
    const hitboxHeight = this.player.height / 4;
    const hitboxYOffset = this.player.height / 4;

    this.hitBox = this.scene.add.zone(
      this.x,
      this.y,
      hitboxWidth,
      hitboxHeight
    );
    this.scene.physics.world.enable(this.hitBox);
    this.hitBox.body.setCollideWorldBounds(true);
    this.hitBox.body.setOffset(0, hitboxYOffset);

    this.scene.add.existing(this);
    this.setSize(hitboxWidth, hitboxHeight);
    this.setDepth(30);

    this.createInputKeyBoard();

    this.prevX = x;
    this.prevY = y;

    this.isAttacking = false; // 공격 상태 추가
    this.isStunned = false;
    this.isWinner = false;

    this.bomb = null;
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
    if (!this.isWinner) {
      this.hitBox.body.setVelocity(0, 0);
      if (
        !this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !==
          (this.player.isDead ? `dead` : `idle${this.player.avatar}`)
      ) {
        this.player.anims.play(
          this.player.isDead ? `dead` : `idle${this.player.avatar}`,
          true
        );
      }
      return;
    }

    if (this.isStunned) {
      this.hitBox.body.setVelocity(0, 0);
      if (
        !this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !==
          (this.player.isDead ? `dead` : `stun${this.player.avatar}`)
      ) {
        this.player.anims.play(
          this.player.isDead ? `dead` : `stun${this.player.avatar}`,
          true
        );
      }
    } else {
      const { velocityX, velocityY } = this.getVelocity();
      this.hitBox.body.setVelocity(velocityX, velocityY);

      if (this.prevX !== this.x || this.prevY !== this.y) {
        this.prevX = this.x;
        this.prevY = this.y;
        SocketManager.emitPlayerMovement({ x: this.x, y: this.y });
      }

      if (
        !this.player.isDead &&
        this.player.isPlay &&
        Phaser.Input.Keyboard.JustDown(this.keys.attack) &&
        !this.isAttacking
      ) {
        this.isAttacking = true;
        this.player.anims.play(`attack${this.player.avatar}`, true);
        this.createClawAttack();
        this.player.on("animationcomplete", (anim) => {
          if (anim.key === `attack${this.player.avatar}`) {
            this.isAttacking = false;
          }
        });
      }

      this.nickname.updatePosition(); // 닉네임 위치 업데이트
      if (this.arrow) {
        this.arrow.updatePosition(); // Arrow 위치 업데이트
      }
      if (this.bomb) {
        this.bomb.updatePosition();
      }

      // 컨테이너 위치 업데이트
      this.setPosition(this.hitBox.x, this.hitBox.y);

      // 플레이어 애니메이션 처리
      if (velocityX !== 0 || velocityY !== 0) {
        if (!this.isAttacking) {
          this.player.anims.play(
            this.player.isDead ? `dead` : `move${this.player.avatar}`,
            true
          );
          this.player.setFlipX(velocityX > 0);
        }
      } else {
        if (!this.isAttacking) {
          this.player.anims.play(
            this.player.isDead ? `dead` : `idle${this.player.avatar}`,
            true
          );
        }
      }
    }
  }

  createClawAttack() {
    const offset = -110; // Claw의 오프셋을 조정합니다
    const clawX = this.hitBox.x + (this.player.flipX ? -offset : offset);
    const clawY = this.hitBox.y;
    const isHeadingRight = this.player.flipX;
    const startingPosition = [clawX, clawY];
    const damage = 10;
    const scale = 1.5;
    new Claw(
      this.scene,
      startingPosition,
      isHeadingRight,
      damage,
      scale,
      this.player.isSelfInitiated
    );
    if (this.player.isSelfInitiated) {
      SocketManager.emitPlayerAttack({ x: clawX, y: clawY });
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
          if (this.player.isDead) {
            this.player.anims.play(`dead`, true);
            this.player.setFlipX(deltaX > 0);
          } else {
            this.player.anims.play(`move${this.player.avatar}`, true);
            this.player.setFlipX(deltaX > 0);
          }
        } else {
          if (this.player.isDead) {
            this.player.anims.play(`dead`, true);
          } else {
            this.player.anims.play(`idle${this.player.avatar}`, true);
          }
        }
      },
      onComplete: () => {
        clearTimeout(this.player.idleTimeout);
        this.player.idleTimeout = setTimeout(() => {
          if (this.player.isDead) {
            this.player.anims.play(`dead`, true);
          } else {
            this.player.anims.play(`idle${this.player.avatar}`, true);
          }
        }, 100);
      },
    });
  }

  stunPlayer() {
    if (this.bomb) return;
    this.isAttacking = false;
    this.isStunned = true;
    new Star(this.scene, this.player, this);
    if (!this.player.isDead) {
      this.player.anims
        .play(`stun${this.player.avatar}`, true)
        .once("animationcomplete", () => {
          this.player.anims.play(`idle${this.player.avatar}`, true);
          this.isStunned = false;
        });
    }
  }

  showChatMessage(message) {
    if (this.chatBalloon) {
      this.chatBalloon.showChatMessage(message);
    }
  }

  setReady() {
    this.bomb = null;
    this.isWinner = false;
    this.isAttacking = false;
    this.player.setReadyStatus();
  }

  setPlay() {
    this.player.setPlayStatus();
  }

  setDead() {
    this.isAttacking = false;
    this.explodeBomb();
    this.player.setDeadStatus();
  }

  setBombUser() {
    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this.player);
      this.add(this.bomb);
    }
  }

  receiveBomb() {
    this.isStunned = true;
    this.isAttacking = false;

    new Star(this.scene, this.player, this);

    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this.player);
      this.add(this.bomb);
    }

    this.player.anims
      .play(`stun${this.player.avatar}`, true)
      .once("animationcomplete", () => {
        this.player.anims.play(`idle${this.player.avatar}`, true);
        this.isStunned = false;
      });
  }

  removeBomb() {
    if (this.bomb) {
      this.bomb.destroy();
      this.bomb = null;
    }
  }

  explodeBomb() {
    if (this.bomb) {
      this.bomb.destroy();
      new Explosion(this.scene, this.player, this);
      this.bomb = null;
    }
  }

  stopMove() {
    if (!this.player.isDead) {
      this.player.anims.play(`idle${this.player.avatar}`, true);
    } else {
      this.player.anims.play(`dead`, true);
    }
    this.isWinner = false;
  }

  choice() {
    if (this.player.isDead) {
      this.player.anims.play(`idle${this.player.avatar}`, true);
      this.player.setAlpha(1);
    }
    this.scene.tweens.add({
      targets: this.player,
      scale: 3,
      duration: 3000,
      ease: "Power1",
      onUpdate: () => {
        const { velocityX, velocityY } = this.getVelocity();
        if (velocityX !== 0 || velocityY !== 0) {
          this.player.anims.play(`move${this.player.avatar}`, true);
          this.player.setFlipX(velocityX > 0);
        }
      },
      onComplete: () => {
        if (!this.scene) return;
        this.scene.tweens.add({
          targets: this.player,
          scale: 1,
          duration: 2000,
          ease: "Power1",
          onUpdate: () => {
            const { velocityX, velocityY } = this.getVelocity();
            if (velocityX !== 0 || velocityY !== 0) {
              this.player.anims.play(`move${this.player.avatar}`, true);
              this.player.setFlipX(velocityX > 0);
            }
          },
          onComplete: () => {
            if (!this.scene) return;
            if (this.player.isDead) {
              this.player.anims.play(`dead`, true);
              this.player.setAlpha(0.3);
            }
            this.stopMove();
          },
        });
      },
    });
  }

  destroy() {
    // Custom cleanup for PlayerContainer
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    if (this.nickname) {
      this.nickname.destroy();
      this.nickname = null;
    }
    if (this.chatBalloon) {
      this.chatBalloon.destroy();
      this.chatBalloon = null;
    }
    if (this.arrow) {
      this.arrow.destroy();
      this.arrow = null;
    }
    if (this.bomb) {
      this.bomb.destroy();
      this.bomb = null;
    }
    if (this.hitBox) {
      this.hitBox.destroy();
      this.hitBox = null;
    }

    // Call the parent class's destroy method
    super.destroy();
  }
}

export default PlayerContainer;
