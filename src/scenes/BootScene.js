import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.setPath("src/assets");
    this.load.image("background", "background.png");
    this.load.spritesheet("player", "player.png", {
      frameWidth: 200,
      frameHeight: 220,
    });
    this.load.spritesheet("player_move", "player_move.png", {
      frameWidth: 200,
      frameHeight: 220,
    });
    this.load.spritesheet("player_attack", "player_attack.png", {
      frameWidth: 200,
      frameHeight: 220,
    });
    this.load.image("bomb", "bomb.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}

export default BootScene;
