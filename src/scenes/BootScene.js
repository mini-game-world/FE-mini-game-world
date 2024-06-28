import Phaser from "phaser";

import backgroundImg from "../assets/background.png";
import playerDeadSprite from "../assets/playerDead.png";
import clawSprite from "../assets/claw_white.png";
import bombSprite from "../assets/bomb.png";
import explosionSprite from "../assets/explosion.png";

// Import map
import first_tileset from "../assets/tiles/first_tileset.png";
import map from "../assets/maps/testMap1.tmj";
import chest_2 from "../assets/tiles/chest_2.png";
import house_1 from "../assets/tiles/house_1.png";
import logs from "../assets/tiles/logs.png";
import stump_2 from "../assets/tiles/stump_2.png";
import Tileset_1 from "../assets/tiles/Tileset_1.png";
import tree_1 from "../assets/tiles/tree_1.png";
import tree_2 from "../assets/tiles/tree_2.png";


// Import Sound
import scratchSound from "../assets/sounds/scratch.ogg";
import timerSound from "../assets/sounds/timer.ogg";
import explosionSound from "../assets/sounds/explosion.ogg";
import winnerSound from "../assets/sounds/winner.ogg";
import playingBGM1 from "../assets/bgm/playingBGM1.mp3";
import playingBGM2 from "../assets/bgm/playingBGM2.mp3";
import waitingBGM1 from "../assets/bgm/waitingBGM1.mp3";
import waitingBGM2 from "../assets/bgm/waitingBGM2.mp3";

// Import player assets from player0 to player30
import player0 from "../assets/players/player0.png";
import player_move0 from "../assets/players/player_move0.png";
import player_attack0 from "../assets/players/player_attack0.png";
import player_stun0 from "../assets/players/player_stun0.png";
import player1 from "../assets/players/player1.png";
import player_move1 from "../assets/players/player_move1.png";
import player_attack1 from "../assets/players/player_attack1.png";
import player_stun1 from "../assets/players/player_stun1.png";
import player2 from "../assets/players/player2.png";
import player_move2 from "../assets/players/player_move2.png";
import player_attack2 from "../assets/players/player_attack2.png";
import player_stun2 from "../assets/players/player_stun2.png";
import player3 from "../assets/players/player3.png";
import player_move3 from "../assets/players/player_move3.png";
import player_attack3 from "../assets/players/player_attack3.png";
import player_stun3 from "../assets/players/player_stun3.png";
import player4 from "../assets/players/player4.png";
import player_move4 from "../assets/players/player_move4.png";
import player_attack4 from "../assets/players/player_attack4.png";
import player_stun4 from "../assets/players/player_stun4.png";
import player5 from "../assets/players/player5.png";
import player_move5 from "../assets/players/player_move5.png";
import player_attack5 from "../assets/players/player_attack5.png";
import player_stun5 from "../assets/players/player_stun5.png";
import player6 from "../assets/players/player6.png";
import player_move6 from "../assets/players/player_move6.png";
import player_attack6 from "../assets/players/player_attack6.png";
import player_stun6 from "../assets/players/player_stun6.png";
import player7 from "../assets/players/player7.png";
import player_move7 from "../assets/players/player_move7.png";
import player_attack7 from "../assets/players/player_attack7.png";
import player_stun7 from "../assets/players/player_stun7.png";
import player8 from "../assets/players/player8.png";
import player_move8 from "../assets/players/player_move8.png";
import player_attack8 from "../assets/players/player_attack8.png";
import player_stun8 from "../assets/players/player_stun8.png";
import player9 from "../assets/players/player9.png";
import player_move9 from "../assets/players/player_move9.png";
import player_attack9 from "../assets/players/player_attack9.png";
import player_stun9 from "../assets/players/player_stun9.png";
import player10 from "../assets/players/player10.png";
import player_move10 from "../assets/players/player_move10.png";
import player_attack10 from "../assets/players/player_attack10.png";
import player_stun10 from "../assets/players/player_stun10.png";
import player11 from "../assets/players/player11.png";
import player_move11 from "../assets/players/player_move11.png";
import player_attack11 from "../assets/players/player_attack11.png";
import player_stun11 from "../assets/players/player_stun11.png";
import player12 from "../assets/players/player12.png";
import player_move12 from "../assets/players/player_move12.png";
import player_attack12 from "../assets/players/player_attack12.png";
import player_stun12 from "../assets/players/player_stun12.png";
import player13 from "../assets/players/player13.png";
import player_move13 from "../assets/players/player_move13.png";
import player_attack13 from "../assets/players/player_attack13.png";
import player_stun13 from "../assets/players/player_stun13.png";
import player14 from "../assets/players/player14.png";
import player_move14 from "../assets/players/player_move14.png";
import player_attack14 from "../assets/players/player_attack14.png";
import player_stun14 from "../assets/players/player_stun14.png";
import player15 from "../assets/players/player15.png";
import player_move15 from "../assets/players/player_move15.png";
import player_attack15 from "../assets/players/player_attack15.png";
import player_stun15 from "../assets/players/player_stun15.png";
import player16 from "../assets/players/player16.png";
import player_move16 from "../assets/players/player_move16.png";
import player_attack16 from "../assets/players/player_attack16.png";
import player_stun16 from "../assets/players/player_stun16.png";
import player17 from "../assets/players/player17.png";
import player_move17 from "../assets/players/player_move17.png";
import player_attack17 from "../assets/players/player_attack17.png";
import player_stun17 from "../assets/players/player_stun17.png";
import player18 from "../assets/players/player18.png";
import player_move18 from "../assets/players/player_move18.png";
import player_attack18 from "../assets/players/player_attack18.png";
import player_stun18 from "../assets/players/player_stun18.png";
import player19 from "../assets/players/player19.png";
import player_move19 from "../assets/players/player_move19.png";
import player_attack19 from "../assets/players/player_attack19.png";
import player_stun19 from "../assets/players/player_stun19.png";
import player20 from "../assets/players/player20.png";
import player_move20 from "../assets/players/player_move20.png";
import player_attack20 from "../assets/players/player_attack20.png";
import player_stun20 from "../assets/players/player_stun20.png";
import player21 from "../assets/players/player21.png";
import player_move21 from "../assets/players/player_move21.png";
import player_attack21 from "../assets/players/player_attack21.png";
import player_stun21 from "../assets/players/player_stun21.png";
import player22 from "../assets/players/player22.png";
import player_move22 from "../assets/players/player_move22.png";
import player_attack22 from "../assets/players/player_attack22.png";
import player_stun22 from "../assets/players/player_stun22.png";
import player23 from "../assets/players/player23.png";
import player_move23 from "../assets/players/player_move23.png";
import player_attack23 from "../assets/players/player_attack23.png";
import player_stun23 from "../assets/players/player_stun23.png";
import player24 from "../assets/players/player24.png";
import player_move24 from "../assets/players/player_move24.png";
import player_attack24 from "../assets/players/player_attack24.png";
import player_stun24 from "../assets/players/player_stun24.png";
import player25 from "../assets/players/player25.png";
import player_move25 from "../assets/players/player_move25.png";
import player_attack25 from "../assets/players/player_attack25.png";
import player_stun25 from "../assets/players/player_stun25.png";
import player26 from "../assets/players/player26.png";
import player_move26 from "../assets/players/player_move26.png";
import player_attack26 from "../assets/players/player_attack26.png";
import player_stun26 from "../assets/players/player_stun26.png";
import player27 from "../assets/players/player27.png";
import player_move27 from "../assets/players/player_move27.png";
import player_attack27 from "../assets/players/player_attack27.png";
import player_stun27 from "../assets/players/player_stun27.png";
import player28 from "../assets/players/player28.png";
import player_move28 from "../assets/players/player_move28.png";
import player_attack28 from "../assets/players/player_attack28.png";
import player_stun28 from "../assets/players/player_stun28.png";
import player29 from "../assets/players/player29.png";
import player_move29 from "../assets/players/player_move29.png";
import player_attack29 from "../assets/players/player_attack29.png";
import player_stun29 from "../assets/players/player_stun29.png";
import player30 from "../assets/players/player30.png";
import player_move30 from "../assets/players/player_move30.png";
import player_attack30 from "../assets/players/player_attack30.png";
import player_stun30 from "../assets/players/player_stun30.png";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("background", backgroundImg);
    // this.load.tilemapTiledJSON('map', 'map');
    this.load.tilemapTiledJSON('map', 'src/assets/maps/village.tmj');
    this.load.image("first_tileset", first_tileset);
    this.load.image("chest_2", chest_2);
    this.load.image("house_1", house_1);
    this.load.image("logs", logs);
    this.load.image("stump_2", stump_2);
    this.load.image("Tileset_1", Tileset_1);
    this.load.image("tree_1", tree_1);
    this.load.image("tree_2", tree_2);

    //audio
    this.load.audio("scratch_sound", scratchSound);
    this.load.audio("timer_sound", timerSound);
    this.load.audio("explosion_sound", explosionSound);
    this.load.audio("winner_sound", winnerSound);
    this.load.audio("playingBGM1", playingBGM1);
    this.load.audio("playingBGM2", playingBGM2);
    this.load.audio("waitingBGM1", waitingBGM1);
    this.load.audio("waitingBGM2", waitingBGM2);

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

    this.load.spritesheet("explosion", explosionSprite, {
      frameWidth: 32,
      frameHeight: 32,
    })

    const players = [
      player0,
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
      player7,
      player8,
      player9,
      player10,
      player11,
      player12,
      player13,
      player14,
      player15,
      player16,
      player17,
      player18,
      player19,
      player20,
      player21,
      player22,
      player23,
      player24,
      player25,
      player26,
      player27,
      player28,
      player29,
      player30,
    ];
    const playerMoves = [
      player_move0,
      player_move1,
      player_move2,
      player_move3,
      player_move4,
      player_move5,
      player_move6,
      player_move7,
      player_move8,
      player_move9,
      player_move10,
      player_move11,
      player_move12,
      player_move13,
      player_move14,
      player_move15,
      player_move16,
      player_move17,
      player_move18,
      player_move19,
      player_move20,
      player_move21,
      player_move22,
      player_move23,
      player_move24,
      player_move25,
      player_move26,
      player_move27,
      player_move28,
      player_move29,
      player_move30,
    ];
    const playerAttacks = [
      player_attack0,
      player_attack1,
      player_attack2,
      player_attack3,
      player_attack4,
      player_attack5,
      player_attack6,
      player_attack7,
      player_attack8,
      player_attack9,
      player_attack10,
      player_attack11,
      player_attack12,
      player_attack13,
      player_attack14,
      player_attack15,
      player_attack16,
      player_attack17,
      player_attack18,
      player_attack19,
      player_attack20,
      player_attack21,
      player_attack22,
      player_attack23,
      player_attack24,
      player_attack25,
      player_attack26,
      player_attack27,
      player_attack28,
      player_attack29,
      player_attack30,
    ];
    const playerStuns = [
      player_stun0,
      player_stun1,
      player_stun2,
      player_stun3,
      player_stun4,
      player_stun5,
      player_stun6,
      player_stun7,
      player_stun8,
      player_stun9,
      player_stun10,
      player_stun11,
      player_stun12,
      player_stun13,
      player_stun14,
      player_stun15,
      player_stun16,
      player_stun17,
      player_stun18,
      player_stun19,
      player_stun20,
      player_stun21,
      player_stun22,
      player_stun23,
      player_stun24,
      player_stun25,
      player_stun26,
      player_stun27,
      player_stun28,
      player_stun29,
      player_stun30,
    ];

    // Load player sprites dynamically
    for (let i = 0; i <= 30; i++) {
      this.load.spritesheet(`player${i}`, players[i], {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_move${i}`, playerMoves[i], {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_attack${i}`, playerAttacks[i], {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_stun${i}`, playerStuns[i], {
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
