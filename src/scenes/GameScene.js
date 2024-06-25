import Phaser from "phaser";
import Player from "../components/Player";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import WinnerPlayer from "../components/WinnerPlayer";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.players = {};
    this.playerCountText = null;
  }

  create() {
    this.add.image(400, 300, "background");

    this.playerCountText = new PlayerCountText(this, 16, 16, 0);

    SocketManager.connect();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const info = { avatar, isPlay, isDead, nickname };
        if (id !== SocketManager.socket.id) {
          this.players[id] = new Player(this, x, y, `player${avatar}`, info);
        } else {
          this.player = new Player(this, x, y, `player${avatar}`, info);
          this.players[SocketManager.socket.id] = this.player;
          this.cameras.main.startFollow(this.player);
          this.cameras.main.setZoom(1);
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, isPlay, nickname } = player;
      const info = { avatar, isPlay, nickname };
      this.players[playerId] = new Player(this, x, y, `player${avatar}`, info);
      this.updatePlayerCountText();
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        console.log("onPlayerMoved", this.players[playerId].isDead);
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
      this.players[id].createClawAttack(false);
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
        console.log("게임시작");
        Object.values(this.players).forEach((player) => {
          player.setPlayStatus();
        });
      } else {
        console.log("게임종료");
        Object.values(this.players).forEach((player) => {
          player.setReadyStatus();
        });
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
      this.WinnerPlayer = new WinnerPlayer(this);
      this.WinnerPlayer.showWinner(this.players[id].name);
    });
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
