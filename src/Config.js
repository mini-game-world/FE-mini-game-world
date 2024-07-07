import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import GameScene from "./scenes/GameScene";

const Config = {
  type: Phaser.AUTO,
  width: 3840,
  height: 2560,
  scene: [BootScene, MainScene, GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

export default Config;
