import Phaser from "phaser";
import Player from "../components/Player";
import Bomb from "../components/Bomb";
import Timer from "../components/Timer";
import SocketManager from "../utils/SocketManager";
import Claw from "../components/Claw";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.players = {};
  }

  create() {
    this.add.image(400, 300, "background");

    SocketManager.connect();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
      const {playerId,x,y, avatar} = players[id];
        if (playerId !== SocketManager.socket.id) {
          this.players[playerId] = new Player(
            this,
            x,
            y,
            `player${avatar}`,
            avatar
          );
        } else {
          this.player = new Player(
            this,
            x,
            y,
            `player${avatar}`,
            avatar
          );
          this.players[SocketManager.socket.id] = this.player;
          // this.player.on("animationcomplete", this.createClaw, this);
        }
      });
    });

    SocketManager.onNewPlayer((player) => {
      const {playerId,x,y, avatar} = player;
      this.players[playerId] = new Player(
        this,
        x,
        y,
        `player${avatar}`,
        avatar
      );
    });

    SocketManager.onPlayerMoved((player) => {
      const {playerId, x, y} = player;
      if (this.players[playerId]) {
        const prevX = this.players[playerId].x;
        this.players[playerId].setPosition(x, y);
        this.players[playerId].anims.play(`move${this.players[playerId].avatar}`, true);
        this.players[playerId].setFlipX(prevX < x); // 방향 설정
        clearTimeout(this.players[playerId].idleTimeout);
        this.players[playerId].idleTimeout = setTimeout(() => {
          this.players[playerId].anims.play(`idle${this.players[playerId].avatar}`, true);
        }, 100);
      }
    });

    SocketManager.onPlayerAttacked((attackedPlayerIds) => {
      attackedPlayerIds.forEach((playerId) => {
        const attackedPlayer =
          playerId === SocketManager.socket.id
            ? this.player
            : this.players[playerId];
  
        if (attackedPlayer) {
          attackedPlayer.stunPlayer();
        }
      });
    });

    SocketManager.onAttackPlayer((playerId) => {
      this.players[playerId].createClawAttack(false);
    });

    SocketManager.onPlayerDisconnected((id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
      }
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
