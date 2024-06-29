import Phaser from "phaser";
import Player from "../components/Player";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import WinnerText from "../components/WinnerText";
import GameStatusText from "../components/GameStatusText";
import MapShrinker from "../utils/MapShrinker";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.players = {};
    this.playerCountText = null;
    this.playingBGMs = [];
    this.waitingBGMs = [];
    this.currentPlayingBGM = null;
    this.currentWaitingBGM = null;
    this.uiCamera = null;
    this.mapShrinker = null;
  }

  create() {
    this.setBackground();
    this.playingBGMs = [
      this.sound.add("playingBGM1", { loop: true, volume: 0.2 }),
      this.sound.add("playingBGM2", { loop: true, volume: 0.2 }),
    ];
    this.waitingBGMs = [
      this.sound.add("waitingBGM1", { loop: true, volume: 0.2 }),
      this.sound.add("waitingBGM2", { loop: true, volume: 0.2 }),
    ];

    // UI 카메라 생성
    this.uiCamera = this.cameras.add(0, 0, 3840, 2560).setScroll(0, 0);
    this.uiCamera.setName("UICamera");

    this.playerCountText = new PlayerCountText(this, 16, 16, 0);
    this.gameStatusText = new GameStatusText(this);

    this.playerCountText.text.setScrollFactor(0); // UI 카메라는 스크롤을 따라가지 않음
    this.uiCamera.ignore(this.backGround);
    this.uiCamera.ignore(this.house);
    this.uiCamera.ignore(this.object);
    this.cameras.main.ignore(this.playerCountText.text);
    this.cameras.main.ignore(this.gameStatusText);

    // MapShrinker 인스턴스 생성 및 시작
    console.log("Creating MapShrinker instance");
    this.mapShrinker = new MapShrinker(this, 3840, 2560, 1300, 1300, 3840, 2560, 32, 24);
    this.mapShrinker.start();

    SocketManager.connect();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        if (id !== SocketManager.socket.id) {
          const isSelfInitiated = false;
          const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };
          this.players[id] = new Player(this, x, y, `player${avatar}`, info);
        } else {
          const isSelfInitiated = true;
          const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };
          this.player = new Player(this, x, y, `player${avatar}`, info);
          this.players[SocketManager.socket.id] = this.player;
          this.smoothCameraFollow(this.player);

          // 충돌 설정
          // this.physics.add.collider(this.player, this.blocklayer);
          this.physics.add.collider(this.player, this.backGround);
          this.physics.add.collider(this.player, this.house);
          this.physics.add.collider(this.player, this.object);

          this.uiCamera.ignore(this.player);
          Object.keys(this.players).forEach((id) => {
            this.uiCamera.ignore(this.players[id]);
          });
          console.log("새플레이어 지금 무시~~");
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, isPlay, nickname } = player;
      const isSelfInitiated = false;
      const info = { avatar, isPlay, nickname, isSelfInitiated };
      this.players[playerId] = new Player(this, x, y, `player${avatar}`, info);
      console.log(player);

      this.uiCamera.ignore(this.players[playerId]);
      console.log("기존 캐릭터들 지금 무시!!");

      // Object.keys(this.players).forEach((id) => {
      //   this.uiCamera.ignore(this.players[id]);
      // });
      this.updatePlayerCountText();
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        const playerSprite = this.players[playerId];
        const prevX = playerSprite.x;

        // Apply tween for smooth movement
        this.tweens.add({
          targets: playerSprite,
          x: x,
          y: y,
          duration: 100, // Duration of the tween
          ease: "Linear", // Easing function
          onUpdate: () => {
            if (this.players[playerId]) {
              if (playerSprite.isDead) {
                playerSprite.anims.play("dead", true);
              } else {
                playerSprite.anims.play(`move${playerSprite.avatar}`, true);
                playerSprite.setFlipX(prevX < x); // 방향 설정
              }
            }
          },
          onComplete: () => {
            if (this.players[playerId]) {
              if (!playerSprite.isDead) {
                clearTimeout(playerSprite.idleTimeout);
                playerSprite.idleTimeout = setTimeout(() => {
                  if (this.players[playerId]) {
                    playerSprite.anims.play(`idle${playerSprite.avatar}`, true);
                  }
                }, 100);
              }
            }
          },
        });
      }
    });

    SocketManager.onPlayerAttacked((ids) => {
      ids.forEach((id) => {
        this.players[id].stunPlayer();
      });
    });

    SocketManager.onAttackPlayer((id) => {
      this.players[id].createClawAttack();
    });

    SocketManager.onPlayerDisconnected((id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
        this.updatePlayerCountText();
      }
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying == 1) {
        this.startPlayingBGM();
        this.gameStatusText.showText("게임시작");
        Object.values(this.players).forEach((player) => {
          player.setPlayStatus();
        });
      } else {
        this.startWaitingBGM();
        this.gameStatusText.showText("게임종료");
        Object.values(this.players).forEach((player) => {
          player.setReadyStatus();
        });
        this.smoothCameraFollow(this.player);
      }
    });

    SocketManager.onBombUsers((players) => {
      players.forEach((id) => {
        this.players[id].setBombUser();
      });
    });

    SocketManager.onDeadUsers((players) => {
      players.forEach((id) => {
        this.players[id].setDeadStatus();
      });
    });

    SocketManager.onChangeBombUser((players) => {
      const current = players[0];
      const previous = players[1];
      this.players[current].receiveBomb();
      this.players[previous].removeBomb();
    });

    SocketManager.onWinnerPlayer((id) => {
      if (this.players[id]) {
        const player = this.players[id];
        player.setWinner();
        this.WinnerText = new WinnerText(this);
        this.WinnerText.showWinner(player.name);
        // // UI 카메라에서 닉네임 무시
      
        // this.cameras.main.ignore(this.WinnerText);
        if (this.player !== player) {
          this.player.stopMove();
          this.smoothCameraFollow(player);
        }
      }
    });

    SocketManager.onBombGameReady((count) => {
      if (this.gameStatusText) {
        this.gameStatusText.showReadyCount(count);
      }
    });

    this.startWaitingBGM();
  }

  startPlayingBGM() {
    if (this.currentWaitingBGM && this.currentWaitingBGM.isPlaying) {
      this.currentWaitingBGM.stop();
    }
    if (this.currentPlayingBGM && this.currentPlayingBGM.isPlaying) {
      this.currentPlayingBGM.stop();
    }

    const randomIndex = Phaser.Math.Between(0, this.playingBGMs.length - 1);
    this.currentPlayingBGM = this.playingBGMs[randomIndex];
    this.currentPlayingBGM.play();
  }

  startWaitingBGM() {
    if (this.currentPlayingBGM && this.currentPlayingBGM.isPlaying) {
      this.currentPlayingBGM.stop();
    }
    if (this.currentWaitingBGM && this.currentWaitingBGM.isPlaying) {
      this.currentWaitingBGM.stop();
    }

    const randomIndex = Phaser.Math.Between(0, this.waitingBGMs.length - 1);
    this.currentWaitingBGM = this.waitingBGMs[randomIndex];
    this.currentWaitingBGM.play();
  }

  setBackground() {
    // 타일맵 설정
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("first_tileset", "first_tileset");
    const chest_2 = map.addTilesetImage("chest_2", "chest_2");
    const house_1 = map.addTilesetImage("house_1", "house_1");
    const logs = map.addTilesetImage("logs", "logs");
    const stump_2 = map.addTilesetImage("stump_2", "stump_2");
    const Tileset_1 = map.addTilesetImage("Tileset_1", "Tileset_1");
    const tree_1 = map.addTilesetImage("tree_1", "tree_1");
    const tree_2 = map.addTilesetImage("tree_2", "tree_2");

    // 레이어 생성 (Tiled에서 설정한 레이어 이름 사용)
    // map.createLayer("Tile Layer 1", tileset, 0, 0);
    // this.blocklayer = map.createLayer("block", tileset, 0, 0);
    // this.blocklayer.setCollisionByProperty({ collides: true });
    this.backGround = map.createLayer("BackGround", Tileset_1, 0, 0);
    this.backGround.setCollisionByProperty({ collides: true });
    this.house = map.createLayer("House", house_1, 0, 0);
    this.house.setCollisionByProperty({ collides: true });
    this.object = map.createLayer("Object", [Tileset_1, chest_2, logs, stump_2, tree_1, tree_2], 0, 0);
    this.object.setCollisionByProperty({ collides: true });


    this.mapShrink = map.createLayer("MapShrink", Tileset_1, 0, 0);
    this.mapShrink.setCollisionByProperty({ collides: true });

    // 충돌 디버그 그래픽 추가
    // this.debugGraphics = this.add.graphics();
    // this.backGround.renderDebug(this.debugGraphics, {
    //   tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
    //   collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
    //   faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    // });
    // this.house.renderDebug(this.debugGraphics, {
    //   tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
    //   collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
    //   faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    // });
    // this.object.renderDebug(this.debugGraphics, {
    //   tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
    //   collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
    //   faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    // });
    // this.mapShrink.renderDebug(this.debugGraphics, {
    //   tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
    //   collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
    //   faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    // });

    // Set world bounds
    console.log(this.backGround.widthInPixels);
    console.log(this.backGround.heightInPixels);
    this.physics.world.setBounds(0, 0, 3840, 2560);
  }

  updatePlayerCountText() {
    const playerCount = Object.keys(this.players).length;
    this.playerCountText.update(playerCount);
  }

  smoothCameraFollow(target) {
    this.cameras.main.stopFollow();
    this.cameras.main.pan(target.x, target.y, 2000, "Sine.easeInOut");
    this.cameras.main.once("camerapancomplete", () => {
      this.cameras.main.startFollow(target);
      this.cameras.main.setZoom(1.5);
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
