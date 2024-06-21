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

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      attack: Phaser.Input.Keyboard.KeyCodes.Z, 
    });

    this.play(`player${this.avatar}_Idle`);
  }
}
