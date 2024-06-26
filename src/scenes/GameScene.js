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
    this.playerCountText = null;
    this.playingbgm1 = null;
    this.waitingbgm1 = null;
  }

  create() {
    this.setBackground();
    this.playingbgm1 = this.sound.add("playingBGM1", {
      loop: true,
      volume: 0.2,
    });
    this.waitingbgm1 = this.sound.add("waitingBGM1", {
      loop: true,
      volume: 0.2,
    });

    this.playerCountText = new PlayerCountText(this, 16, 16, 0);

    this.gameStatusText = new GameStatusText(this);

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
          this.physics.add.collider(this.player, this.blocklayer);
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, isPlay, nickname } = player;
      const isSelfInitiated = false;
      const info = { avatar, isPlay, nickname, isSelfInitiated };
      this.players[playerId] = new Player(this, x, y, `player${avatar}`, info);
      this.updatePlayerCountText();
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        if (this.players[playerId].isDead) {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play("dead", true);
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
        } else {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play(
            `move${this.players[playerId].avatar}`,
            true
          );
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
          clearTimeout(this.players[playerId].idleTimeout);
          this.players[playerId].idleTimeout = setTimeout(() => {
            this.players[playerId].anims.play(
              `idle${this.players[playerId].avatar}`,
              true
            );
          }, 100);
        }
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
      this.players[current].setBombUser();
      this.players[previous].removeBomb();
    });

    SocketManager.onWinnerPlayer((id) => {
      const player = this.players[id];
      player.setWinner();
      this.WinnerText = new WinnerText(this);
      this.WinnerText.showWinner(player.name);
      if (this.player !== player) {
        this.player.stopMove();
        this.smoothCameraFollow(player);
      }
    });
    this.startWaitingBGM();
  }

  startPlayingBGM() {
    if (this.waitingbgm1.isPlaying) {
      this.waitingbgm1.stop();
    }
    if (!this.playingbgm1.isPlaying) {
      this.playingbgm1.play();
    }
  }

  startWaitingBGM() {
    if (this.playingbgm1.isPlaying) {
      this.playingbgm1.stop();
    }
    if (!this.waitingbgm1.isPlaying) {
      this.waitingbgm1.play();
    }
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
    this.debugGraphics = this.add.graphics();
    this.blocklayer.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.blocklayer.renderDebug(this.debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
      faceColor: new Phaser.Display.Color(0, 255, 0, 128),
    });
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
