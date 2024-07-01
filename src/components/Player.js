import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";
import Claw from "./Claw";
import Bomb from "./Bomb";
import Nickname from "./Nickname";
import Arrow from "./Arrow";
import Crown from "./Crown";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, info) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.avatar = info.avatar;
    this.isSelfInitiated = info.isSelfInitiated;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.body.setSize(50, 50); // 히트박스 크기 설정 (너비, 높이)
    this.body.setOffset(75, 150); // 히트박스 오프셋 설정 (x, y)

    this.bomb = null;
    this.name = info.nickname;
    this.nickname = new Nickname(scene, this, this.name);

    this.scale = 1;
    this.setDepth(30);

    this.createInputKeyBoard();
    this.createAnimations();

    // this.isAttacking = false;
    this.isStunned = false;
    this.isPlay = this.processInfo(info.isPlay);
    this.isDead = this.processInfo(info.isDead);
    this.isWinner = false;

    if (this.isDead) {
      this.setDeadStatus(); // 죽은 상태
    } else {
      if (this.isPlay) {
        this.setPlayStatus(); // 게임 중인 상태
      } else {
        this.setReadyStatus(); // 준비 상태
      }
    }

    this.prevX = x;
    this.prevY = y;

    this.chatBalloon = this.scene.add.container(this.x, this.y - 50).setDepth(31).setVisible(false);
    this.balloonGraphics = this.scene.add.graphics();
    this.chatText = this.scene.add.text(0, 0, "", {
      fontSize: "24px", 
      fill: "#000000", 
      padding: { x: 10, y: 5 },
      align: "center",
      wordWrap: { width: 280, useAdvancedWrap: true } // 텍스트 줄바꿈
    }).setOrigin(0.5);

    this.chatBalloon.add(this.balloonGraphics);
    this.chatBalloon.add(this.chatText);

    this.arrow = null;
    this.crown = null;
    if (this.isSelfInitiated) {
      this.arrow = new Arrow(this.scene, this);
    }
  }

  processInfo(value) {
    if (value === undefined) {
      return false;
    }
    return value === 1;
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

  setDeadStatus() {
    this.explodeBomb();
    this.setTexture("playerDead");
    this.anims.play(`dead`, true);
    // this.isAttacking = false;
    this.isDead = true;
    this.setAlpha(0.3);
    this.nickname.setColor("#F78181");

    this.body.checkCollision.none = true;
  }

  setReadyStatus() {
    this.setTexture(`player${this.avatar}`);
    this.setAlpha(0.5);
    if (this.isDead) {
      this.anims.play(`idle${this.avatar}`, true);
    }
    this.nickname.setColor("#ffffff");
    this.removeBomb();
    this.isDead = false;
    this.isPlay = false;
    this.isWinner = false;
    this.body.checkCollision.none = false;
  }

  setPlayStatus() {
    this.setAlpha(1);
    this.isPlay = true;
    this.isDead = false;
    this.nickname.setColor("#ffffff");
    this.body.checkCollision.none = false;
  }

  createAnimations() {
    this.scene.anims.create({
      key: `idle${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(`player${this.avatar}`),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `move${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(
        `player_move${this.avatar}`
      ),
      frameRate: 5,
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

    this.scene.anims.create({
      key: `stun${this.avatar}`,
      frames: this.scene.anims.generateFrameNumbers(
        `player_stun${this.avatar}`
      ),
      frameRate: 5,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "dead",
      frames: this.scene.anims.generateFrameNumbers("playerDead"),
      frameRate: 6,
      repeat: -1,
    });

    this.on("animationcomplete", (anim, frame) => {
      if (anim.key === `attack${this.avatar}`) {
        // this.isAttacking = false;
        this.createClawAttack();
      }
    });
  }

  getVelocity() {
    const speed = this.bomb ? 700 : 600;
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
      this.setVelocity(0, 0);
      return;
    }

    if (this.isStunned) {
      this.setVelocity(0, 0);
      return;
    }

    const { velocityX, velocityY } = this.getVelocity();
    this.setVelocity(velocityX, velocityY);

    if (this.prevX !== this.x || this.prevY !== this.y) {
      this.prevX = this.x;
      this.prevY = this.y;
      SocketManager.emitPlayerMovement({ x: this.x, y: this.y });
    }

    if (this.isDead) {
      this.anims.play("dead", true);
      if (velocityX !== 0 || velocityY !== 0) {
        this.setFlipX(velocityX > 0);
      }
    } else {
      if (this.keys.attack.isDown && this.isPlay && !this.isDead) {
        // this.isAttacking = true;
        this.anims.play(`attack${this.avatar}`, true);
        if (velocityX !== 0 || velocityY !== 0) {
          this.setFlipX(velocityX > 0);
        }
      } else if (velocityX !== 0 || velocityY !== 0) {
        this.anims.play(`move${this.avatar}`, true);
        this.setFlipX(velocityX > 0);
      } else {
        this.anims.play(`idle${this.avatar}`, true);
      }
    }

    if (this.chatBalloon.visible) {
      this.chatBalloon.setPosition(this.x, this.y - 50);
    }
  }
  
  createClawAttack() {
    const offset = -50;
    const clawX = this.x + (this.flipX ? -offset : offset);
    const clawY = this.y;
    const isHeadingRight = this.flipX;
    const startingPosition = [clawX, clawY];
    const damage = 10;
    const scale = 1.5;
    new Claw(
      this.scene,
      startingPosition,
      isHeadingRight,
      damage,
      scale,
      this.isSelfInitiated
    );
    if (this.isSelfInitiated) {
      SocketManager.emitPlayerAttack({ x: clawX, y: clawY });
    }
  }

  stunPlayer() {
    if (this.bomb) return;
    this.isStunned = true;
    // this.isAttacking = false;
    this.setVelocity(0, 0);
    if (!this.isDead) {
      this.anims.play(`stun${this.avatar}`, true);
    }
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      yoyo: true,
      repeat: 1,
      duration: 50,
      onComplete: () => {
        if (!this.isDead) {
          this.anims.play(`idle${this.avatar}`, true);
        }
      },
    });
    this.scene.time.delayedCall(500, () => {
      this.isStunned = false;
    });
  }

  setBombUser() {
    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this);
    }
  }

  receiveBomb() {
    if (!this.bomb) {
      this.bomb = new Bomb(this.scene, this);
    }
    this.isStunned = true;
    // this.isAttacking = false;
    this.setVelocity(0, 0);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      yoyo: true,
      repeat: 1,
      duration: 50,
      onComplete: () => {
        this.anims.play(`idle${this.avatar}`, true);
      },
    });
    this.scene.time.delayedCall(500, () => {
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
      this.bomb.explode();
      this.bomb = null;
    }
  }

  stopMove() {
    this.isWinner = false;
    if(!this.isDead){
      this.anims.play(`idle${this.avatar}`, true);
    }
  }

  setWinner() {
    if (!this.scene) return;
    this.stopMove();
    this.nickname.setColor("#FFD700");
    const originalScale = this.scale;
    this.crown = new Crown(this.scene, this);
    this.scene.tweens.add({
      targets: this,
      scale: originalScale * 3,
      duration: 2000,
      ease: "Power1",
      onUpdate: () => {
        if (!this.nickname) return;
        this.nickname.updatePosition();
      },
      onComplete: () => {
        if (!this.scene) return;
        this.scene.time.delayedCall(2000, () => {
          if (!this.scene) return;
          this.scene.tweens.add({
            targets: this,
            scale: originalScale,
            duration: 2000,
            ease: "Power1",
            onUpdate: () => {
              if (!this.nickname) return;
              this.nickname.updatePosition();
            },
            onComplete: () => {
              this.crown.destroy();
            },
          });
        });
      },
    });
  }

  setPosition(x, y) {
    super.setPosition(x, y);
  }

  destroy() {
    this.removeBomb();

    if (this.nickname) {
      this.nickname.destroy();
      this.nickname = null;
    }

    if (this.arrow) {
      this.arrow.destroy();
      this.arrow = null;
    }

    if (this.crown) {
      this.crown.destroy();
      this.crown = null;
    }
    super.destroy();
  }

  showChatMessage(message) {
    this.chatText.setText(message);

    const padding = 20;
    const balloonWidth = this.chatText.width + padding;
    const balloonHeight = this.chatText.height + padding + 10; 

    this.balloonGraphics.clear();
    this.balloonGraphics.fillStyle(0xffffff, 1);
    this.balloonGraphics.fillRoundedRect(
      -balloonWidth / 2,
      -balloonHeight / 2,
      balloonWidth,
      balloonHeight - 10,
      15
    );
    this.balloonGraphics.fillTriangle(
      -10,
      balloonHeight / 2 - 10,
      10,
      balloonHeight / 2 - 10,
      0,
      balloonHeight / 2
    );

    this.chatBalloon.setVisible(true);
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.chatBalloon.setVisible(false);
      },
      callbackScope: this
    });
  }
}

export default Player;
