import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import GameScene from "./scenes/GameScene";
import TutorialScene from "./scenes/TutorialScene";

const platform = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  ? "mobile"
  : "other";

const Config = {
  type: Phaser.AUTO,
  width: 4160,
  height: 3200,
  audio: {
    noAudio: platform === "mobile",
  },
  scene: [BootScene, MainScene, TutorialScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      fps: 60,
    },
  },
  render: {
    pixelArt: true,
    roundPixels: true,
  },
  input: {
    activePointers: 3,
  },
};

export default Config;
