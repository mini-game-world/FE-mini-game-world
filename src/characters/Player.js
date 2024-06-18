import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x = Config.width / 2,
    y = Config.height / 2,
    texture = "player"
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 0.4;
    this.setDepth(20);

    this.setBodySize(28, 32);

    this.m_moving = false;
    this.m_attacking = false;
  }

  move(vector) {
    if (this.m_attacking) return;
    let PLAYER_SPEED = 3;

    this.x += vector[0] * PLAYER_SPEED;
    this.y += vector[1] * PLAYER_SPEED;

    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;

    if (vector[0] !== 0 || vector[1] !== 0) {
      if (!this.m_moving) {
        this.play("player_anim");
        this.m_moving = true;
      }
    } else {
      if (this.m_moving) {
        this.play("player_idle");
        this.m_moving = false;
      }
    }

    this.scene.socket.emit("playerMovement", {
      x: this.scene.m_player.x,
      y: this.scene.m_player.y,
    });
  }

  attack() {
    // if (this.m_attacking) return; // 이미 공격 중이면 아무것도 하지 않음
    // this.m_attacking = true;
    // this.play("attack", true);
    // this.once("animationcomplete", () => {
    //   this.m_attacking = false;
    //   this.play("player_anim");
    // });
  }
}
