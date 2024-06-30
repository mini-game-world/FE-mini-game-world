import Phaser from "phaser";
import Player from "../components/Player";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import WinnerText from "../components/WinnerText";
import GameStatusText from "../components/GameStatusText";
import MapShrinker from "../utils/MapShrinker";
import BGMManager from "../utils/BGMManager";
import CameraManager from "../utils/CameraManager";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null;

    this.players = {};
    this.activePlayers = {};
    this.deadPlayers = {};
    this.waitingPlayers = {};

    this.WinnerText = null;
    this.playerCountText = null;
    this.gameStatusText = null;

    this.bgmManager = null;
    this.cameraManager = null;
    this.mapShrinker = null;
  }

  create() {
    SocketManager.connect();
    this.setBackground();


    this.bgmManager = new BGMManager(this);
    this.cameraManager = new CameraManager(this);

    this.WinnerText = new WinnerText(this);
    this.playerCountText = new PlayerCountText(this);
    this.gameStatusText = new GameStatusText(this);

    // MapShrinker 인스턴스 생성 및 시작
    console.log("Creating MapShrinker instance");
    this.mapShrinker = new MapShrinker(
      this,
      3840,
      2560,
      1300,
      1300,
      3840,
      2560,
      32,
      24
    );
    this.mapShrinker.start();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const isSelfInitiated = id === SocketManager.socket.id;
        const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };
        const player = new Player(this, x, y, `player${avatar}`, info);
        this.players[id] = player;

        if (isSelfInitiated) {
          this.player = player;
          this.cameraManager.smoothFollow(this.player);

          // 충돌 설정
          // this.physics.add.collider(this.player, this.blocklayer);
          this.physics.add.collider(this.player, this.backGround);
          this.physics.add.collider(this.player, this.house);
          this.physics.add.collider(this.player, this.object);
        }

        if (isPlay) {
          this.activePlayers[id] = player;
        } else if (isDead) {
          this.deadPlayers[id] = player;
        } else {
          this.waitingPlayers[id] = player;
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, nickname } = player;
      const isSelfInitiated = false;
      const info = { avatar, nickname, isSelfInitiated };
      const newPlayer = new Player(this, x, y, `player${avatar}`, info);
      this.players[playerId] = newPlayer;
      this.waitingPlayers[playerId] = newPlayer;

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
      }
      if (this.activePlayers[id]) {
        this.activePlayers[id].destroy();
        delete this.activePlayers[id];
      }
      if (this.deadPlayers[id]) {
        this.deadPlayers[id].destroy();
        delete this.deadPlayers[id];
      }
      if (this.waitingPlayers[id]) {
        this.waitingPlayers[id].destroy();
        delete this.waitingPlayers[id];
      }
      this.updatePlayerCountText();
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying == 1) {
        this.bgmManager.startPlayingBGM();
        this.gameStatusText.showStart();
        Object.values(this.players).forEach((player) => {
          player.setPlayStatus();
          this.activePlayers[player.id] = player;
          delete this.waitingPlayers[player.id];
        });
        this.mapShrinker.start();
      } else {
        this.bgmManager.startWaitingBGM();
        this.gameStatusText.showEnd();
        Object.values(this.players).forEach((player) => {
          player.setReadyStatus();
          this.waitingPlayers[player.id] = player;
          delete this.activePlayers[player.id];
        });
        this.cameraManager.smoothFollow(this.player);
        this.mapShrinker.reset();
      }
    });

    SocketManager.onBombUsers((players) => {
      players.forEach((id) => {
        this.players[id].setBombUser();
      });
    });

    SocketManager.onDeadUsers((players) => {
      players.forEach((id) => {
        if (this.players[id]) {
          this.players[id].setDeadStatus();
          this.deadPlayers[id] = this.players[id];
          delete this.activePlayers[id];
        }
      });
    });

    SocketManager.onChangeBombUser((players) => {
      const current = players[0];
      const previous = players[1];
      if (this.players[current]) {
        this.players[current].receiveBomb();
      }
      if (this.players[previous]) {
        this.players[previous].removeBomb();
      }
    });

    SocketManager.onWinnerPlayer((id) => {
      if (this.players[id]) {
        const player = this.players[id];
        player.setWinner();
        this.WinnerText.showWinner(player.name);

        if (this.player !== player) {
          this.player.stopMove();
          this.cameraManager.smoothFollow(player);
        }
      }
    });

    SocketManager.onBombGameReady((count) => {
      if (this.gameStatusText) {
        if (count === -1) {
          this.gameStatusText.showWait();
        } else {
          this.gameStatusText.showReadyCount(count);
        }
      }
    });

    // 게임 접속 시 현재 상태 확인
    SocketManager.onGameStatus((status) => {
      if (status === 1) {
        this.gameStatusText.showProceeding();
      } else {
        this.gameStatusText.showWait();
      }
    });
    this.bgmManager.startWaitingBGM();
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
    this.object = map.createLayer(
      "Object",
      [Tileset_1, chest_2, logs, stump_2, tree_1, tree_2],
      0,
      0
    );
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

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
