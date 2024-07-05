import Phaser from "phaser";
import CollisionChecker from "../utils/CollisionChecker";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, info) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.avatar = info.avatar;
    this.isSelfInitiated = info.isSelfInitiated;
    this.nickname = info.nickname;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setScale(1);
    this.setDepth(30);

    this.createAnimations();

    this.isPlay = this.processInfo(info.isPlay);
    this.isDead = this.processInfo(info.isDead);

    this.speed = 600; // 기본 속도 설정

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

  processInfo(value) {
    if (value === undefined) {
      return false;
    }
    return value === 1;
  }

  setDeadStatus() {
    this.isDead = true;
    this.isPlay = true;
    this.setTexture("playerDead");
    this.anims.play(`dead`, true);
    this.setAlpha(0.3);
    
    // 물리 충돌을 비활성화
    this.body.checkCollision.none = true;
  }

  setReadyStatus() {
    this.isDead = false;
    this.isPlay = false;
    this.setTexture(`player${this.avatar}`);
    this.anims.play(`idle${this.avatar}`, true);
    this.setAlpha(0.5);
    this.setScale(1);
    
    // 물리 충돌을 활성화
    this.body.checkCollision.none = false;
  }

  setPlayStatus() {
    this.isPlay = true;
    this.isDead = false;
    this.setAlpha(1);
    
    // 물리 충돌을 활성화
    this.body.checkCollision.none = false;
  }
}

export default Player;
