import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import GameScene from "./scenes/GameScene";
import TutorialScene from "./scenes/TutorialScene";

const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  ? "ios"
  : "other";

const Config = {
  type: Phaser.AUTO,
  width: 3840,
  height: 2560,
  audio: {
    noAudio: platform === "ios",
  },
  scene: [BootScene, MainScene, TutorialScene, GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

export default Config;
