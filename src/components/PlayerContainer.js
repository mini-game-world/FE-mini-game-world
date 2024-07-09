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
import CollisionChecker from "../utils/CollisionChecker";
import StatusIcon from "./StatusIcon";

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
    this.speed = 600; // 기본 속도 추가

    this.statusIcon = null;

    this.collisionChecker = new CollisionChecker();

    // 터치 이동 속성 추가
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (this.isMobile && this.player.isSelfInitiated) {
      this.scene.input.on("pointerdown", this.handleTouch, this);
      this.createTouchButton();
    }

    // For touch movement
    this.targetX = null;
    this.targetY = null;
  }

  handleTouch(pointer) {
    if (this.player) {
      // 공격 버튼 내부 터치 여부 확인
      if (
        this.attackButton &&
        this.attackButton.getBounds().contains(pointer.worldX, pointer.worldY)
      ) {
        return; // 공격 버튼을 터치한 경우 이동 처리 안 함
      }

      const maxDistance = 300; // 최대 이동 거리 설정
      let targetX = pointer.worldX;
      let targetY = pointer.worldY;
      const distance = Phaser.Math.Distance.Between(
        this.hitBox.x,
        this.hitBox.y,
        targetX,
        targetY
      );

      if (distance > maxDistance) {
        const angle = Phaser.Math.Angle.Between(
          this.hitBox.x,
          this.hitBox.y,
          targetX,
          targetY
        );
        targetX = this.hitBox.x + Math.cos(angle) * maxDistance;
        targetY = this.hitBox.y + Math.sin(angle) * maxDistance;
      }

      this.targetX = targetX;
      this.targetY = targetY;
    }
  }

  createTouchButton() {
    const buttonSize = 100;
    const buttonX = this.scene.cameras.main.width / 2 + 900;
    const buttonY = this.scene.cameras.main.height / 2 + 500;

    this.attackButton = this.scene.add.circle(
      buttonX,
      buttonY,
      buttonSize * 2,
      0xff0000,
      10.5
    );
    this.attackButton.setScrollFactor(0); // Button stays in the same place on screen

    this.attackButton.setInteractive();
    this.attackButton.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation(); // 터치 이벤트 전파 방지
      if (this.player.isPlay && !this.isAttacking && !this.player.isDead) {
        // 버튼 시각적 반응 추가
        this.scene.tweens.add({
          targets: this.attackButton,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 100,
          yoyo: true,
          ease: "Quad.easeInOut",
        });

        this.isAttacking = true;
        this.player.anims.play(`attack${this.player.avatar}`, true);
        this.createClawAttack();
        this.player.on("animationcomplete", (anim) => {
          if (anim.key === `attack${this.player.avatar}`) {
            this.isAttacking = false;
          }
        });
      }
    });
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
    if (this.speed < 900) {
      if (this.bomb) {
        this.speed = 800;
      } else {
        this.speed = 700;
      }
    }
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.up.isDown) velocityY = -this.speed;
    if (this.keys.down.isDown) velocityY = this.speed;
    if (this.keys.left.isDown) velocityX = -this.speed;
    if (this.keys.right.isDown) velocityX = this.speed;

    return { velocityX, velocityY };
  }

  update() {
    if (!this.player.isDead) {
      this.collisionChecker.checkCollisionAndMove(this);
    }

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
      let { velocityX, velocityY } = this.getVelocity();

      if (this.targetX !== null && this.targetY !== null) {
        const angle = Phaser.Math.Angle.Between(
          this.hitBox.x,
          this.hitBox.y,
          this.targetX,
          this.targetY
        );
        velocityX = Math.cos(angle) * this.speed;
        velocityY = Math.sin(angle) * this.speed;

        const distance = Phaser.Math.Distance.Between(
          this.hitBox.x,
          this.hitBox.y,
          this.targetX,
          this.targetY
        );

        if (distance < 10) {
          this.targetX = null;
          this.targetY = null;
          velocityX = 0;
          velocityY = 0;
        }
      }

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
        if (!this.hitBox || !this.player) return;
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
        if (!this.player) return;
        clearTimeout(this.player.idleTimeout);
        this.player.idleTimeout = setTimeout(() => {
          if (!this.player) return;
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
          if (!this.player) return;
          this.player.anims.play(`idle${this.player.avatar}`, true);
          this.isStunned = false;
        });
    } else {
      this.player.anims.play(`dead`, true);
      this.isStunned = false;
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
    this.hitBox.body.checkCollision.none = false;
  }

  setPlay() {
    this.player.setPlayStatus();
    this.hitBox.body.checkCollision.none = false;
  }

  setDead() {
    this.isAttacking = false;
    this.explodeBomb();
    this.player.setDeadStatus();
    this.hitBox.body.checkCollision.none = true;
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
        if (!this.player) return;
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
      this.player.isDead = false;
      this.player.setTexture(`player${this.player.avatar}`);
      this.player.anims.play(`idle${this.player.avatar}`, true);
      this.player.setAlpha(1);
      this.hitBox.body.checkCollision.none = false;
    }
    this.scene.tweens.add({
      targets: this.player,
      scale: 3,
      duration: 2000,
      ease: "Power1",
      onUpdate: () => {
        if (!this.player) return;
        const { velocityX, velocityY } = this.getVelocity();
        if (velocityX !== 0 || velocityY !== 0) {
          this.player.anims.play(`move${this.player.avatar}`, true);
          this.player.setFlipX(velocityX > 0);
        }
      },
      onComplete: () => {
        if (!this.scene || !this.player) return;
        this.scene.tweens.add({
          targets: this.player,
          scale: 1,
          duration: 2000,
          ease: "Power1",
          onUpdate: () => {
            if (!this.player) return;
            const { velocityX, velocityY } = this.getVelocity();
            if (velocityX !== 0 || velocityY !== 0) {
              this.player.anims.play(`move${this.player.avatar}`, true);
              this.player.setFlipX(velocityX > 0);
            }
          },
        });
      },
    });
  }

  addStatusIcon(item) {
    if (this.statusIcon) {
      this.statusIcon.destroy();
    }
    const iconX = this.player.x + this.player.width / 2 + 20; // 플레이어 오른쪽에 아이콘 위치
    const iconY = this.player.y;
    this.statusIcon = new StatusIcon(this.scene, iconX, iconY, item);
    this.add(this.statusIcon);

    this.scene.time.delayedCall(5000, () => {
      if (this.statusIcon) {
        this.statusIcon.destroy();
        this.statusIcon = null;
      }
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
    if (this.statusIcon) {
      this.statusIcon.destroy();
      this.statusIcon = null;
    }
    // Call the parent class's destroy method
    super.destroy();
  }
}

export default PlayerContainer;
