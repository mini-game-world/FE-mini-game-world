import Phaser from "phaser";
import Move from "./Move";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, playerInfo) {
    super(scene, playerInfo.x, playerInfo.y, `playerIdle${playerInfo.avatar}`);

    // Add the sprite to the scene
    scene.add.existing(this);
    // Add physics to the sprite
    scene.physics.add.existing(this);

    this.scene = scene;
    this.avatar = playerInfo.avatar;
    this.id = playerInfo.id;
    this.isAttacking = false;

    this.sprite = scene.add.existing(this);
    this.setScale(0.4);
    // this.scene.physics.world.enable(this);

    this.move = new Move(scene, this); 

    this.setCollideWorldBounds(true);

    // Set player position to the center of the screen
    this.setPosition(scene.game.config.width / 2, scene.game.config.height / 2);
  }

  update() {
    this.move.update(); 
  }

  setPosition(x, y) {
    super.setPosition(x, y)
  }
}
