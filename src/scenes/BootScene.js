import Phaser from "phaser";

import faviconIco from "../assets/favicon.webp";
import backgroundImg from "../assets/background.webp";

import bombKingImg from "../assets/result/bombKing.webp";
import boxingImg from "../assets/result/boxing.webp";
import crownImg from "../assets/result/crown.webp";

import bombSprite from "../assets/bomb/bomb.webp";
import explosionSprite from "../assets/bomb/explosion.webp";

import arrowImg from "../assets/players/arrow.webp";
import bangImg from "../assets/players/bang.webp";
import BodyExplosionSprite from "../assets/players/bodyExplosion.webp";
import clawSprite from "../assets/players/claw_white.webp";
import starSprite from "../assets/players/star.webp";

import speedUpImg from "../assets/icon/speedUp.webp";
import speedDownImg from "../assets/icon/speedDown.webp";
import badSightImg from "../assets/icon/badSight.webp";
import reverseImg from "../assets/icon/reverse.webp";

// Import Item
import itemImg from "../assets/item/item.webp";
import questionImg from "../assets/item/question.webp";

// Import map
import map from "../assets/maps/village.tmj";

import first_tileset from "../assets/tiles/first_tileset.webp";
import chest_2 from "../assets/tiles/chest_2.webp";
import house_1 from "../assets/tiles/house_1.webp";
import logs from "../assets/tiles/logs.webp";
import stump_2 from "../assets/tiles/stump_2.webp";
import Tileset_1 from "../assets/tiles/Tileset_1.webp";
import tree_1 from "../assets/tiles/tree_1.webp";
import tree_2 from "../assets/tiles/tree_2.webp";
import stone_1 from "../assets/tiles/stone_1.webp";
import stone_3 from "../assets/tiles/stone_3.webp";
import fence_1 from "../assets/tiles/fence_1.webp";
import fence_3 from "../assets/tiles/fence_3.webp";

// Import Sound
import scratchSound from "../assets/sounds/scratch.ogg";
import timerSound from "../assets/sounds/timer.ogg";
import explosionSound from "../assets/sounds/explosion.ogg";
import winnerSound from "../assets/sounds/winner.ogg";
import buttonClickSound from "../assets/sounds/ButtonClick.ogg";
import acquireSound from "../assets/sounds/acquire.ogg";

// Import bgm
import mainBGM from "../assets/sounds/bgm/mainBGM.ogg";
import playingBGM1 from "../assets/sounds/bgm/playingBGM1.ogg";
import playingBGM2 from "../assets/sounds/bgm/playingBGM2.ogg";
import waitingBGM1 from "../assets/sounds/bgm/waitingBGM1.ogg";
import waitingBGM2 from "../assets/sounds/bgm/waitingBGM2.ogg";

// Import player assets from player0 to player30
import playerDeadSprite from "../assets/players/sprite/playerDead.webp";

import player0 from "../assets/players/sprite/player0.webp";
import player_move0 from "../assets/players/sprite/player_move0.webp";
import player_attack0 from "../assets/players/sprite/player_attack0.webp";
import player_stun0 from "../assets/players/sprite/player_stun0.webp";
import player1 from "../assets/players/sprite/player1.webp";
import player_move1 from "../assets/players/sprite/player_move1.webp";
import player_attack1 from "../assets/players/sprite/player_attack1.webp";
import player_stun1 from "../assets/players/sprite/player_stun1.webp";
import player2 from "../assets/players/sprite/player2.webp";
import player_move2 from "../assets/players/sprite/player_move2.webp";
import player_attack2 from "../assets/players/sprite/player_attack2.webp";
import player_stun2 from "../assets/players/sprite/player_stun2.webp";
import player3 from "../assets/players/sprite/player3.webp";
import player_move3 from "../assets/players/sprite/player_move3.webp";
import player_attack3 from "../assets/players/sprite/player_attack3.webp";
import player_stun3 from "../assets/players/sprite/player_stun3.webp";
import player4 from "../assets/players/sprite/player4.webp";
import player_move4 from "../assets/players/sprite/player_move4.webp";
import player_attack4 from "../assets/players/sprite/player_attack4.webp";
import player_stun4 from "../assets/players/sprite/player_stun4.webp";
import player5 from "../assets/players/sprite/player5.webp";
import player_move5 from "../assets/players/sprite/player_move5.webp";
import player_attack5 from "../assets/players/sprite/player_attack5.webp";
import player_stun5 from "../assets/players/sprite/player_stun5.webp";
import player6 from "../assets/players/sprite/player6.webp";
import player_move6 from "../assets/players/sprite/player_move6.webp";
import player_attack6 from "../assets/players/sprite/player_attack6.webp";
import player_stun6 from "../assets/players/sprite/player_stun6.webp";
import player7 from "../assets/players/sprite/player7.webp";
import player_move7 from "../assets/players/sprite/player_move7.webp";
import player_attack7 from "../assets/players/sprite/player_attack7.webp";
import player_stun7 from "../assets/players/sprite/player_stun7.webp";
import player8 from "../assets/players/sprite/player8.webp";
import player_move8 from "../assets/players/sprite/player_move8.webp";
import player_attack8 from "../assets/players/sprite/player_attack8.webp";
import player_stun8 from "../assets/players/sprite/player_stun8.webp";
import player9 from "../assets/players/sprite/player9.webp";
import player_move9 from "../assets/players/sprite/player_move9.webp";
import player_attack9 from "../assets/players/sprite/player_attack9.webp";
import player_stun9 from "../assets/players/sprite/player_stun9.webp";
import player10 from "../assets/players/sprite/player10.webp";
import player_move10 from "../assets/players/sprite/player_move10.webp";
import player_attack10 from "../assets/players/sprite/player_attack10.webp";
import player_stun10 from "../assets/players/sprite/player_stun10.webp";
import player11 from "../assets/players/sprite/player11.webp";
import player_move11 from "../assets/players/sprite/player_move11.webp";
import player_attack11 from "../assets/players/sprite/player_attack11.webp";
import player_stun11 from "../assets/players/sprite/player_stun11.webp";
import player12 from "../assets/players/sprite/player12.webp";
import player_move12 from "../assets/players/sprite/player_move12.webp";
import player_attack12 from "../assets/players/sprite/player_attack12.webp";
import player_stun12 from "../assets/players/sprite/player_stun12.webp";
import player13 from "../assets/players/sprite/player13.webp";
import player_move13 from "../assets/players/sprite/player_move13.webp";
import player_attack13 from "../assets/players/sprite/player_attack13.webp";
import player_stun13 from "../assets/players/sprite/player_stun13.webp";
import player14 from "../assets/players/sprite/player14.webp";
import player_move14 from "../assets/players/sprite/player_move14.webp";
import player_attack14 from "../assets/players/sprite/player_attack14.webp";
import player_stun14 from "../assets/players/sprite/player_stun14.webp";
import player15 from "../assets/players/sprite/player15.webp";
import player_move15 from "../assets/players/sprite/player_move15.webp";
import player_attack15 from "../assets/players/sprite/player_attack15.webp";
import player_stun15 from "../assets/players/sprite/player_stun15.webp";
import player16 from "../assets/players/sprite/player16.webp";
import player_move16 from "../assets/players/sprite/player_move16.webp";
import player_attack16 from "../assets/players/sprite/player_attack16.webp";
import player_stun16 from "../assets/players/sprite/player_stun16.webp";
import player17 from "../assets/players/sprite/player17.webp";
import player_move17 from "../assets/players/sprite/player_move17.webp";
import player_attack17 from "../assets/players/sprite/player_attack17.webp";
import player_stun17 from "../assets/players/sprite/player_stun17.webp";
import player18 from "../assets/players/sprite/player18.webp";
import player_move18 from "../assets/players/sprite/player_move18.webp";
import player_attack18 from "../assets/players/sprite/player_attack18.webp";
import player_stun18 from "../assets/players/sprite/player_stun18.webp";
import player19 from "../assets/players/sprite/player19.webp";
import player_move19 from "../assets/players/sprite/player_move19.webp";
import player_attack19 from "../assets/players/sprite/player_attack19.webp";
import player_stun19 from "../assets/players/sprite/player_stun19.webp";
import player20 from "../assets/players/sprite/player20.webp";
import player_move20 from "../assets/players/sprite/player_move20.webp";
import player_attack20 from "../assets/players/sprite/player_attack20.webp";
import player_stun20 from "../assets/players/sprite/player_stun20.webp";
import player21 from "../assets/players/sprite/player21.webp";
import player_move21 from "../assets/players/sprite/player_move21.webp";
import player_attack21 from "../assets/players/sprite/player_attack21.webp";
import player_stun21 from "../assets/players/sprite/player_stun21.webp";
import player22 from "../assets/players/sprite/player22.webp";
import player_move22 from "../assets/players/sprite/player_move22.webp";
import player_attack22 from "../assets/players/sprite/player_attack22.webp";
import player_stun22 from "../assets/players/sprite/player_stun22.webp";
import player23 from "../assets/players/sprite/player23.webp";
import player_move23 from "../assets/players/sprite/player_move23.webp";
import player_attack23 from "../assets/players/sprite/player_attack23.webp";
import player_stun23 from "../assets/players/sprite/player_stun23.webp";
import player24 from "../assets/players/sprite/player24.webp";
import player_move24 from "../assets/players/sprite/player_move24.webp";
import player_attack24 from "../assets/players/sprite/player_attack24.webp";
import player_stun24 from "../assets/players/sprite/player_stun24.webp";
import player25 from "../assets/players/sprite/player25.webp";
import player_move25 from "../assets/players/sprite/player_move25.webp";
import player_attack25 from "../assets/players/sprite/player_attack25.webp";
import player_stun25 from "../assets/players/sprite/player_stun25.webp";
import player26 from "../assets/players/sprite/player26.webp";
import player_move26 from "../assets/players/sprite/player_move26.webp";
import player_attack26 from "../assets/players/sprite/player_attack26.webp";
import player_stun26 from "../assets/players/sprite/player_stun26.webp";
import player27 from "../assets/players/sprite/player27.webp";
import player_move27 from "../assets/players/sprite/player_move27.webp";
import player_attack27 from "../assets/players/sprite/player_attack27.webp";
import player_stun27 from "../assets/players/sprite/player_stun27.webp";
import player28 from "../assets/players/sprite/player28.webp";
import player_move28 from "../assets/players/sprite/player_move28.webp";
import player_attack28 from "../assets/players/sprite/player_attack28.webp";
import player_stun28 from "../assets/players/sprite/player_stun28.webp";
import player29 from "../assets/players/sprite/player29.webp";
import player_move29 from "../assets/players/sprite/player_move29.webp";
import player_attack29 from "../assets/players/sprite/player_attack29.webp";
import player_stun29 from "../assets/players/sprite/player_stun29.webp";
import player30 from "../assets/players/sprite/player30.webp";
import player_move30 from "../assets/players/sprite/player_move30.webp";
import player_attack30 from "../assets/players/sprite/player_attack30.webp";
import player_stun30 from "../assets/players/sprite/player_stun30.webp";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // 이미지 로드
    const images = {
      favicon: faviconIco,
      background: backgroundImg,
      arrow: arrowImg,
      crown: crownImg,
      boxing: boxingImg,
      bombKing: bombKingImg,
      item: itemImg,
      speedUp: speedUpImg,
      badSight: badSightImg,
      speedDown: speedDownImg,
      reverse: reverseImg,
      question: questionImg,
      bang: bangImg,
      first_tileset: first_tileset,
      chest_2: chest_2,
      house_1: house_1,
      logs: logs,
      stump_2: stump_2,
      Tileset_1: Tileset_1,
      tree_1: tree_1,
      tree_2: tree_2,
      stone_1: stone_1,
      stone_3: stone_3,
      fence_1: fence_1,
      fence_3: fence_3,
    };

    for (const [key, value] of Object.entries(images)) {
      this.load.image(key, value);
    }

    // 타일맵 로드
    this.load.tilemapTiledJSON("map", map);

    // 오디오 로드
    const audios = {
      scratch_sound: scratchSound,
      timer_sound: timerSound,
      explosion_sound: explosionSound,
      winner_sound: winnerSound,
      click_sound: buttonClickSound,
      acquire_sound: acquireSound,
      playingBGM1: playingBGM1,
      playingBGM2: playingBGM2,
      waitingBGM1: waitingBGM1,
      waitingBGM2: waitingBGM2,
      mainBGM: mainBGM,
    };

    for (const [key, value] of Object.entries(audios)) {
      this.load.audio(key, value);
    }

    // 스프라이트 시트 로드
    const spriteSheets = [
      {
        key: "playerDead",
        path: playerDeadSprite,
        frameWidth: 150,
        frameHeight: 150,
      },
      { key: "claw_white", path: clawSprite, frameWidth: 32, frameHeight: 32 },
      { key: "bomb", path: bombSprite, frameWidth: 303, frameHeight: 142 },
      {
        key: "explosion",
        path: explosionSprite,
        frameWidth: 32,
        frameHeight: 32,
      },
      {
        key: "BodyExplosion",
        path: BodyExplosionSprite,
        frameWidth: 204,
        frameHeight: 204,
      },
      { key: "star", path: starSprite, frameWidth: 150, frameHeight: 150 },
    ];

    spriteSheets.forEach((sheet) => {
      this.load.spritesheet(sheet.key, sheet.path, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
      });
    });

    // 플레이어 스프라이트 동적 로드
    const players = [
      {
        base: player0,
        move: player_move0,
        attack: player_attack0,
        stun: player_stun0,
      },
      {
        base: player1,
        move: player_move1,
        attack: player_attack1,
        stun: player_stun1,
      },
      {
        base: player2,
        move: player_move2,
        attack: player_attack2,
        stun: player_stun2,
      },
      {
        base: player3,
        move: player_move3,
        attack: player_attack3,
        stun: player_stun3,
      },
      {
        base: player4,
        move: player_move4,
        attack: player_attack4,
        stun: player_stun4,
      },
      {
        base: player5,
        move: player_move5,
        attack: player_attack5,
        stun: player_stun5,
      },
      {
        base: player6,
        move: player_move6,
        attack: player_attack6,
        stun: player_stun6,
      },
      {
        base: player7,
        move: player_move7,
        attack: player_attack7,
        stun: player_stun7,
      },
      {
        base: player8,
        move: player_move8,
        attack: player_attack8,
        stun: player_stun8,
      },
      {
        base: player9,
        move: player_move9,
        attack: player_attack9,
        stun: player_stun9,
      },
      {
        base: player10,
        move: player_move10,
        attack: player_attack10,
        stun: player_stun10,
      },
      {
        base: player11,
        move: player_move11,
        attack: player_attack11,
        stun: player_stun11,
      },
      {
        base: player12,
        move: player_move12,
        attack: player_attack12,
        stun: player_stun12,
      },
      {
        base: player13,
        move: player_move13,
        attack: player_attack13,
        stun: player_stun13,
      },
      {
        base: player14,
        move: player_move14,
        attack: player_attack14,
        stun: player_stun14,
      },
      {
        base: player15,
        move: player_move15,
        attack: player_attack15,
        stun: player_stun15,
      },
      {
        base: player16,
        move: player_move16,
        attack: player_attack16,
        stun: player_stun16,
      },
      {
        base: player17,
        move: player_move17,
        attack: player_attack17,
        stun: player_stun17,
      },
      {
        base: player18,
        move: player_move18,
        attack: player_attack18,
        stun: player_stun18,
      },
      {
        base: player19,
        move: player_move19,
        attack: player_attack19,
        stun: player_stun19,
      },
      {
        base: player20,
        move: player_move20,
        attack: player_attack20,
        stun: player_stun20,
      },
      {
        base: player21,
        move: player_move21,
        attack: player_attack21,
        stun: player_stun21,
      },
      {
        base: player22,
        move: player_move22,
        attack: player_attack22,
        stun: player_stun22,
      },
      {
        base: player23,
        move: player_move23,
        attack: player_attack23,
        stun: player_stun23,
      },
      {
        base: player24,
        move: player_move24,
        attack: player_attack24,
        stun: player_stun24,
      },
      {
        base: player25,
        move: player_move25,
        attack: player_attack25,
        stun: player_stun25,
      },
      {
        base: player26,
        move: player_move26,
        attack: player_attack26,
        stun: player_stun26,
      },
      {
        base: player27,
        move: player_move27,
        attack: player_attack27,
        stun: player_stun27,
      },
      {
        base: player28,
        move: player_move28,
        attack: player_attack28,
        stun: player_stun28,
      },
      {
        base: player29,
        move: player_move29,
        attack: player_attack29,
        stun: player_stun29,
      },
      {
        base: player30,
        move: player_move30,
        attack: player_attack30,
        stun: player_stun30,
      },
    ];

    players.forEach((player, i) => {
      this.load.spritesheet(`player${i}`, player.base, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_move${i}`, player.move, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_attack${i}`, player.attack, {
        frameWidth: 200,
        frameHeight: 220,
      });
      this.load.spritesheet(`player_stun${i}`, player.stun, {
        frameWidth: 200,
        frameHeight: 220,
      });
    });
  }

  create() {
    this.anims.create({
      key: "claw_white",
      frames: this.anims.generateFrameNumbers("claw_white"),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "bomb",
      frames: this.anims.generateFrameNumbers("bomb"),
      frameRate: 5,
      repeat: -1,
    });

    this.textures.removeKey("unusedImage");

    this.scene.start("MainScene");
  }
}

export default BootScene;
