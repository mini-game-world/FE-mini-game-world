import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.setPath("src/assets/players");
    this.load.image("background", "../../assets/background.png");
    for (let i = 0; i < 6; i++) {
      this.load.spritesheet(`player${i}`, `player${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_move${i}`, `player_move${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_attack${i}`, `player_attack${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
    }

    this.load.image("bomb", "bomb.png");
  }

  create() {
    this.scene.start("GameScene");
  }
}

export default BootScene;
