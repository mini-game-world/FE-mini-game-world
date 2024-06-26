import Phaser from "phaser";

import playerDeadSprite from "../assets/playerDead.png";
import clawSprite from "../assets/claw_white.png";
import bombSprite from "../assets/bomb.png";

import testMap1 from "../assets/maps/testMap1.tmj";
import first_tileset from "../assets/tiles/first_tileset.png";

import scratchSound from "../assets/sounds/scratch.ogg";
import explosionSound from "../assets/sounds/explosion.ogg";
import timerSound from "../assets/sounds/timer.ogg";
import winnerSound from "../assets/sounds/winner.ogg";

import playingBGM1 from "../assets/bgm/playingBGM1.mp3";
import playingBGM2 from "../assets/bgm/playingBGM2.mp3";
import waitingBGM1 from "../assets/bgm/waitingBGM1.mp3";
import waitingBGM2 from "../assets/bgm/waitingBGM2.mp3";

const playerAssets = [];
for (let i = 0; i <= 30; i++) {
  playerAssets.push({
    idle: require(`../assets/players/player${i}.png`),
    move: require(`../assets/players/player_move${i}.png`),
    attack: require(`../assets/players/player_attack${i}.png`),
    stun: require(`../assets/players/player_stun${i}.png`),
  });
}

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.audio("scratch_sound", scratchSound);
    this.load.audio("explosion_sound", explosionSound);
    this.load.audio("timer_sound", timerSound);
    this.load.audio("winner_sound", winnerSound);

    this.load.audio("playingBGM1", playingBGM1);
    this.load.audio("playingBGM2", playingBGM2);
    this.load.audio("waitingBGM1", waitingBGM1);
    this.load.audio("waitingBGM2", waitingBGM2);

    this.load.tilemapTiledJSON("map", testMap1);
    this.load.image("tiles", first_tileset);

    this.load.spritesheet("playerDead", playerDeadSprite, {
      frameWidth: 150,
      frameHeight: 150,
    });

    this.load.spritesheet("claw_white", clawSprite, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("bomb", bombSprite, {
      frameWidth: 303,
      frameHeight: 142,
    });

    for (let i = 0; i <= 30; i++) {
      this.load.spritesheet(`player${i}`, playerAssets[i].idle, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_move${i}`, playerAssets[i].move, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_attack${i}`, playerAssets[i].attack, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_stun${i}`, playerAssets[i].stun, {
        frameWidth: 200,
        frameHeight: 220,
      });
    }
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
