import Phaser from "phaser";
import Bomb from "./Bomb";
import Crown from "./Crown";
import Star from "./Star";
import Punching_bag from "./Punching_bag";
import Bomb_master from "./Bomb_master";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, info) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.avatar = info.avatar;
    this.isSelfInitiated = info.isSelfInitiated;

    this.scene.add.existing(this);
    this.star = null;
    this.bomb = null;
    this.nickname = info.nickname;

    this.setScale(1);
    this.setDepth(30);

    this.createAnimations();

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

    this.crown = null;
    this.punching_bag = null;
    this.bombking = null;
  }

  processInfo(value) {
    if (value === undefined) {
      return false;
    }
    return value === 1;
  }

  setDeadStatus() {
    this.explodeBomb();
    this.setTexture("playerDead");
    this.anims.play(`dead`, true);
    this.isDead = true;
    this.setAlpha(0.3);
  }

  setReadyStatus() {
    this.setTexture(`player${this.avatar}`);
    this.setAlpha(0.5);
    if (this.isDead) {
      this.anims.play(`idle${this.avatar}`, true);
    }
    this.setScale(1);
    this.isDead = false;
    this.isPlay = false;
    this.isWinner = false;
    this.isAttacking = false;
  }

  setPlayStatus() {
    this.setAlpha(1);
    this.isPlay = true;
    this.isDead = false;
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
      frameRate: 15,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "dead",
      frames: this.scene.anims.generateFrameNumbers("playerDead"),
      frameRate: 6,
      repeat: -1,
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
    this.anims.play(`idle${this.avatar}`, true);
    this.isAttacking = false;

    if (!this.star) {
      this.star = new Star(this.scene, this);
    }
    this.scene.time.delayedCall(500, () => {
      this.isStunned = false;
      if (this.star) {
        this.star.destroy();
        this.star = null;
      }
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
    if (!this.isDead) {
      this.anims.play(`idle${this.avatar}`, true);
    }
    this.isWinner = false;
    this.isAttacking = false;
  }

  setCrown() {
    if (!this.scene) return;
    const originalScale = this.scale;

    if (!this.crown) {
      this.crown = new Crown(this.scene, this);
    }

    this.scene.tweens.add({
      targets: this,
      scale: originalScale * 3,
      duration: 1500,
      ease: "Power1",
      onUpdate: () => {
        if (!this.nickname) return;
        this.nickname.updatePosition();
      },
      onComplete: () => {
        if (!this.scene) return;
        this.scene.time.delayedCall(1500, () => {
          if (!this.scene) return;
          this.scene.tweens.add({
            targets: this,
            scale: originalScale,
            duration: 1500,
            ease: "Power1",
            onUpdate: () => {
              if (!this.nickname) return;
              this.nickname.updatePosition();
            },
            onComplete: () => {
              if (!this.scene) return;
              this.stopMove();
              if (this.crown) {
                this.crown.destroy();
                this.crown = null;
              }
            },
          });
        });
      },
    });
  }

  setPunching_bag() {
    if (!this.scene) return;

    if (this.isDead) {
      this.setTexture(`player${this.avatar}`);
      this.anims.play(`idle${this.avatar}`, true);
      this.setAlpha(1);
      this.isDead = false;
    }

    const originalScale = this.scale;

    this.punching_bag = new Punching_bag(this.scene, this);

    this.scene.tweens.add({
      targets: this,
      scale: originalScale * 3,
      duration: 1500,
      ease: "Power1",
      onUpdate: () => {
        if (!this.nickname) return;
        this.nickname.updatePosition();
      },
      onComplete: () => {
        if (!this.scene) return;
        this.scene.time.delayedCall(1500, () => {
          if (!this.scene) return;
          this.scene.tweens.add({
            targets: this,
            scale: originalScale,
            duration: 1500,
            ease: "Power1",
            onUpdate: () => {
              if (!this.nickname) return;
              this.nickname.updatePosition();
            },
            onComplete: () => {
              if (!this.scene) return;
              this.stopMove();
              if (this.punching_bag) {
                this.punching_bag.destroy();
                this.punching_bag = null;
              }
            },
          });
        });
      },
    });
  }

  setBombMaster() {
    if (!this.scene) return;

    if (this.isDead) {
      this.setTexture(`player${this.avatar}`);
      this.anims.play(`idle${this.avatar}`, true);
      this.setAlpha(1);
      this.isDead = false;
    }

    const originalScale = this.scale;

    this.bomb_master = new Bomb_master(this.scene, this);

    this.scene.tweens.add({
      targets: this,
      scale: originalScale * 3,
      duration: 1500,
      ease: "Power1",
      onUpdate: () => {
        if (!this.nickname) return;
        this.nickname.updatePosition();
      },
      onComplete: () => {
        if (!this.scene) return;
        this.scene.time.delayedCall(1500, () => {
          if (!this.scene) return;
          this.scene.tweens.add({
            targets: this,
            scale: originalScale,
            duration: 1500,
            ease: "Power1",
            onUpdate: () => {
              if (!this.nickname) return;
              this.nickname.updatePosition();
            },
            onComplete: () => {
              if (!this.scene) return;
              this.stopMove();
              if (this.bomb_master) {
                this.bomb_master.destroy();
                this.bomb_master = null;
              }
            },
          });
        });
      },
    });
  }
}

export default Player;
