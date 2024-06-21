import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, playerInfo) {
    super(scene, playerInfo.x, playerInfo.y, `playerIdle${playerInfo.avatar}`);
    this.scene = scene;
    this.avatar = playerInfo.avatar;
    this.id = playerInfo.id;
    this.isAttacking = false;

    this.scene.add.existing(this);
    this.setScale(0.4);

    this.createAnimations();
    this.play(`player${this.avatar}_Idle`);
  }

  createAnimations() {
    this.scene.anims.create({
      key: `player${this.avatar}_Run`,
      frames: this.scene.anims.generateFrameNumbers(`playerRun${this.avatar}`),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: `player${this.avatar}_Idle`,
      frames: this.scene.anims.generateFrameNumbers(`playerIdle${this.avatar}`),
      frameRate: 12,
      repeat: -1,
    });
    this.scene.anims.create({
      key: `player${this.avatar}_Stun`,
      frames: this.scene.anims.generateFrameNumbers(`playerStun${this.avatar}`),
      frameRate: 12,
      repeat: 0,
    });
    this.scene.anims.create({
      key: `player${this.avatar}_Attack`,
      frames: this.scene.anims.generateFrameNumbers(
        `playerAttack${this.avatar}`
      ),
      frameRate: 12,
      repeat: 0,
    });

    this.on("animationcomplete", (anim, frame) => {
      if (anim.key === `player${this.avatar}_Attack`) {
        this.isAttacking = false;
      }
    });
  }

  updatePosition(x, y) {
    this.setPosition(x, y);
  }
}
