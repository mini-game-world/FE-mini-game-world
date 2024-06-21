import Phaser from "phaser";
import Move from "./Move";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, playerInfo) {
    super(scene, playerInfo.x, playerInfo.y, `playerIdle${playerInfo.avatar}`);
    this.scene = scene;
    this.avatar = playerInfo.avatar;
    this.id = playerInfo.id;
    this.isAttacking = false;

    this.sprite = scene.add.existing(this);
    this.setScale(0.4);

    this.move = new Move(scene, this); 
  }

  update() {
    this.move.update(); 
  }
}
