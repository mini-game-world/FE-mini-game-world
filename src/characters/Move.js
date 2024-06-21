import Phaser from "phaser";

export default class Move {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });
  }

  getVelocity() {
    const speed = 160;
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.up.isDown) velocityY = -speed;
    if (this.keys.down.isDown) velocityY = speed;
    if (this.keys.left.isDown) velocityX = -speed;
    if (this.keys.right.isDown) velocityX = speed;

    return { velocityX, velocityY };
  }

  update() {
    const { velocityX, velocityY } = this.getVelocity();
    this.player.setVelocity(velocityX, velocityY);

    if (velocityX !== 0 || velocityY !== 0) {
      this.player.anims.play(`player${this.player.avatar}_Run`, true);
      this.player.setFlipX(velocityX < 0);
    } else {
      this.player.anims.play(`player${this.player.avatar}_Idle`, true);
    }
  }
}
