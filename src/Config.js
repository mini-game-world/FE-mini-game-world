import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MainScene from "./scenes/MainScene";
import GameScene from "./scenes/GameScene";
import TutorialScene from "./scenes/TutorialScene";

// 모바일 기기 감지
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const Config = {
  type: Phaser.AUTO,
  width: 4160,
  height: 3200,
  scene: [BootScene, MainScene, TutorialScene, GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.LANDSCAPE,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  parent: "game-container",
};

if (isMobile) {
  Config.scale.orientation = Phaser.Scale.LANDSCAPE;
}

export default Config;
