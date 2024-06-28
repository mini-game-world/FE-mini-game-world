import Phaser from "phaser";
import Player from "../components/Player";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import WinnerText from "../components/WinnerText";
import GameStatusText from "../components/GameStatusText";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.players = {};
    this.activePlayers = {};
    this.deadPlayers = {};
    this.waitingPlayers = {};

    this.playerCountText = null;
    this.playingBGMs = [];
    this.waitingBGMs = [];
    this.currentPlayingBGM = null;
    this.currentWaitingBGM = null;
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

    this.playerCountText = new PlayerCountText(this, 16, 16, 0);

    this.gameStatusText = new GameStatusText(this);

    SocketManager.connect();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const isSelfInitiated = id === SocketManager.socket.id;
        const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };
        const player = new Player(this, x, y, `player${avatar}`, info);
        this.players[id] = player;
        if (isSelfInitiated) {
          this.player = player;
          this.smoothCameraFollow(this.player);
          this.physics.add.collider(this.player, this.blocklayer);
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
        delete this.activePlayers[id];
        delete this.deadPlayers[id];
        delete this.waitingPlayers[id];
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
    const tileset = map.addTilesetImage("first_tileset", "tiles");

    // 레이어 생성 (Tiled에서 설정한 레이어 이름 사용)
    map.createLayer("Tile Layer 1", tileset, 0, 0);
    this.blocklayer = map.createLayer("block", tileset, 0, 0);
    this.blocklayer.setCollisionByProperty({ collides: true });

    // 충돌 디버그 그래픽 추가
    // this.debugGraphics = this.add.graphics();
    // this.blocklayer.renderDebug(this.debugGraphics, {
    //   tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
    //   collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
    //   faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    // });
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
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
