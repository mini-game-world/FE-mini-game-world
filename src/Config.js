import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";

const Config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

export default Config;
