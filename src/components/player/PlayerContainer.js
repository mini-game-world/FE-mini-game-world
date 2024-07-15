import Phaser from "phaser";

import SocketManager from "../../utils/SocketManager";
import Player from "./Player";
import Nickname from "./Nickname";
import ChatBalloon from "../chat/ChatBalloon";
import Arrow from "./Arrow";
import CollisionCheckerManager from "../../utils/CollisionCheckerManager";
import Joystick from "./Joystick";
import ChatDisplay from "../chat/ChatDisplay";
import Claw from "./Claw";
import Star from "./Star";
import Bomb from "../bomb/Bomb";
import Bang from "./Bang";
import Explosion from "../bomb/Explosion";
import BodyExplosion from "./BodyExplosion";
import StatusIcon from "../item/StatusIcon";
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
    this.isReversed = false;

    this.bomb = null;
    this.speed = 600; // 기본 속도 추가

    this.statusIcons = [];

    this.collisionCheckerManager = new CollisionCheckerManager();

    this.chatDisplay = null;

    this.pendingPromise = null;

    if (
      this.scene.sys.game.device.os.android ||
      this.scene.sys.game.device.os.iPhone ||
      this.scene.sys.game.device.os.iPad
    ) {
      if (this.player.isSelfInitiated) {
        this.joystick = new Joystick(this.scene);
        this.createTouchButton();
        // Add extra pointers
        this.scene.input.addPointer(2); // Adding two more pointers for a total of three
      }
    } else {
      if (this.player.isSelfInitiated) {
        this.chatDisplay = new ChatDisplay(this.scene);
      }
    }
  }

  createTouchButton() {
    const buttonSize = 100;
    const buttonX = this.scene.cameras.main.width / 2 + 850;
    const buttonY = this.scene.cameras.main.height / 2 + 450;

    this.attackButton = this.scene.add.circle(
      buttonX,
      buttonY,
      buttonSize,
      0xff0000,
      0.4
    );
    this.attackButton.setScrollFactor(0); // Button stays in the same place on screen

    this.attackButton.setInteractive();
    this.attackButton.on("pointerdown", () => {
      this.handleAttack();
    });

    this.attackButtonText = this.scene.add.text(buttonX, buttonY, "Attack", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.attackButtonText.setOrigin(0.5);
    this.attackButtonText.setScrollFactor(0); // Text stays in the same place on screen
  }

  handleAttack() {
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
  }

  createInputKeyBoard() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z, // 공격 키 추가
      switch: Phaser.Input.Keyboard.KeyCodes.Q, // Q 키 추가
      focus: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
  }

  handleRemoteAttack() {
    if (this.isAttacking) return; // Prevent multiple attacks at the same time

    this.isAttacking = true;
    this.player.anims.play(`attack${this.player.avatar}`, true);
    this.createClawAttack();
    this.player.once("animationcomplete", (anim) => {
      if (anim.key === `attack${this.player.avatar}`) {
        this.isAttacking = false;
        if (!this.player.isDead) {
          this.player.anims.play(`idle${this.player.avatar}`, true);
        }
      }
    });
  }

  getVelocity() {
    if (this.speed < 800) {
      if (this.bomb) {
        this.speed = 700;
      } else {
        if (this.speed < 500) {
          this.speed = 400;
        } else {
          this.speed = 600;
        }
      }
    }

    let velocityX = 0;
    let velocityY = 0;

    if (!this.isReversed) {
      if (this.keys.up.isDown) velocityY = -this.speed;
      if (this.keys.down.isDown) velocityY = this.speed;
      if (this.keys.left.isDown) velocityX = -this.speed;
      if (this.keys.right.isDown) velocityX = this.speed;
    } else {
      if (this.keys.up.isDown) velocityY = this.speed;
      if (this.keys.down.isDown) velocityY = -this.speed;
      if (this.keys.left.isDown) velocityX = this.speed;
      if (this.keys.right.isDown) velocityX = -this.speed;
    }

    if (this.joystick) {
      const force = this.joystick.getForce();
      if (force > 0) {
        const angle = Phaser.Math.DegToRad(this.joystick.getAngle()); // 각도를 라디안으로 변환
        let joystickX = Math.cos(angle) * this.speed;
        let joystickY = Math.sin(angle) * this.speed;

        if (this.isReversed) {
          joystickX = -joystickX; // 조이스틱의 X값 반전
          joystickY = -joystickY; // 조이스틱의 Y값 반전
        }

        velocityX = joystickX;
        velocityY = joystickY;
      }
    }

    return { velocityX, velocityY };
  }

  update() {
    if (!this.player.isDead) {
      this.collisionCheckerManager.checkCollisionAndMove(this);
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
        this.handleAttack();
      }

      // Update container position
      this.setPosition(this.hitBox.x, this.hitBox.y);

      // Handle player animations
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
    if (this.player.isDead && this.player.isPlay) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.switch)) {
        this.scene.switchTarget();
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.focus)) {
        this.scene.switchToPlayer();
      }
    }
  }

  createClawAttack() {
    const claw = new Claw(this.scene, this.hitBox, this.player);
    this.add(claw);
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
          } else if (!this.isAttacking) {
            this.player.anims.play(`move${this.player.avatar}`, true);
            this.player.setFlipX(deltaX > 0);
          }
        } else {
          if (this.player.isDead) {
            this.player.anims.play(`dead`, true);
          } else if (!this.isAttacking) {
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
          } else if (!this.isAttacking) {
            this.player.anims.play(`idle${this.player.avatar}`, true);
          }
        }, 100);
      },
    });
  }

  async stunPlayer() {
    if (this.bomb) return;
    this.isAttacking = false;
    this.isStunned = true;
    new Star(this.scene, this.player, this);

    return new Promise((resolve) => {
      this.pendingPromise = new Promise((resolveInner) => {
        if (!this.player.isDead) {
          this.player.anims
            .play(`stun${this.player.avatar}`, true)
            .once("animationcomplete", () => {
              if (!this.player) return;
              this.player.anims.play(`idle${this.player.avatar}`, true);
              this.isStunned = false;
              resolveInner();
              resolve();
            });
        } else {
          this.player.anims.play(`dead`, true);
          this.isStunned = false;
          resolveInner();
          resolve();
        }
      }).finally(() => {
        this.pendingPromise = null;
      });
    });
  }

  showChatMessage(message) {
    if (this.chatBalloon) {
      this.chatBalloon.showChatMessage(message);
    }
  }

  setReady() {
    this.isAttacking = false;
    if (this.bomb) {
      this.bomb.destroy();
      this.bomb = null;
    }
    this.nickname.setColor("#ffffff");
    this.player.setReadyStatus();
  }

  setPlay() {
    this.player.setPlayStatus();
  }

  async setDead() {
    // stunPlayer나 receiveBomb이 실행중이면 끝날 때까지 기다림
    if (this.pendingPromise && this.player.isSelfInitiated) {
      await this.pendingPromise;
    }

    this.isAttacking = false;
    this.explodeBomb();
    this.player.setDeadStatus();
    this.nickname.setColor("#ff0000");
  }

  setBombUser() {
    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this.player);
      this.add(this.bomb);
      this.bringToTop(this.chatBalloon);
    }
  }

  async receiveBomb() {
    if (this.player.isPlay && this.player.isDead) return;
    this.isStunned = true;
    this.isAttacking = false;

    new Bang(this.scene, this.player, this);

    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this.player);
      this.add(this.bomb);
      this.bringToTop(this.chatBalloon);
    }

    return new Promise((resolve) => {
      this.pendingPromise = new Promise((resolveInner) => {
        if (this.player.isPlay && this.player.isDead) return;
        this.player.anims
          .play(`stun${this.player.avatar}`, true)
          .once("animationcomplete", () => {
            if (!this.player) return;
            if (this.player.isPlay && this.player.isDead) return;
            this.player.anims.play(`idle${this.player.avatar}`, true);
            this.isStunned = false;
            resolveInner();
            resolve();
          });
      }).finally(() => {
        this.pendingPromise = null;
      });
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
      new BodyExplosion(this.scene, this.player, this);
      this.bomb = null;
    }
  }

  stopMove() {
    this.isWinner = false;
  }

  setWinner() {
    this.player.isDead = false;
    this.player.setAlpha(1);
    this.nickname.setColor("#ffffff");
    this.player.setTexture(`player${this.player.avatar}`);
    this.player.anims.play(`idle${this.player.avatar}`, true);
  }

  choice(showFunction) {
    return new Promise((resolve) => {
      this.nickname.setColor("#FFD700");

      showFunction.call(this.scene.resultText, this.player.nickname);

      this.scene.tweens.add({
        targets: this,
        scale: 3,
        duration: 1500,
        ease: "Power1",
        onComplete: () => {
          if (!this.scene || !this) return;
          this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 1000,
            ease: "Power1",
            onComplete: () => {
              if (!this.scene || !this) return;
              if (this.nickname) {
                this.nickname.setColor("#ffffff");
              }

              if (this.scene.resultText) {
                this.scene.resultText.del();
              }

              resolve();
            },
          });
        },
      });
    });
  }

  addMessage(nickname, message) {
    if (this.chatDisplay) {
      this.chatDisplay.addMessage(nickname, message);
    }
  }

  addStatusIcon(item, time) {
    const iconX = this.player.x + this.player.width / 2 + 20; // 플레이어 오른쪽에 아이콘 위치
    const iconY = this.player.y;
    const statusIcon = new StatusIcon(this.scene, iconX, iconY, item);
    this.add(statusIcon);
    this.statusIcons.push(statusIcon);

    this.scene.time.delayedCall(time, () => {
      const index = this.statusIcons.indexOf(statusIcon);
      if (index !== -1) {
        statusIcon.destroy();
        this.statusIcons.splice(index, 1);
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
    if (this.joystick) {
      this.joystick.destroy();
      this.joystick = null;
    }
    // Call the parent class's destroy method
    super.destroy();
  }
}

export default PlayerContainer;
