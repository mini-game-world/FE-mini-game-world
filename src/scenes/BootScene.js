import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.setPath("src/assets");
    this.load.image("background", "background.png");

    for (let i = 0; i < 6; i++) {
      this.load.spritesheet(`player${i}`, `/players/player${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_move${i}`, `/players/player_move${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_attack${i}`, `/players/player_attack${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_stun${i}`, `/players/player_stun${i}.png`, {
        frameWidth: 200,
        frameHeight: 220,
      });
    }

    
    this.load.audio("audio_scratch", "/sounds/scratch.ogg"); 

    this.load.spritesheet("claw_white", "claw_white.png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    this.load.image("bomb", "bomb.png");
  }

  create() {
    

    this.anims.create({
      key: "claw_white",
      frames: this.anims.generateFrameNumbers("claw_white"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true,
    });

    this.scene.start("GameScene");
  }
}

export default BootScene;
