import Phaser from "phaser";
import Player from "../components/Player";
import Bomb from "../components/Bomb";
import Timer from "../components/Timer";
import SocketManager from "../utils/SocketManager";

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
      console.log("onCurrentPlayers");
      console.log(players);
      Object.keys(players).forEach((id) => {
        if (players[id].playerId !== SocketManager.socket.id) {
          this.players[players[id].playerId] = new Player(
            this,
            players[id].x,
            players[id].y,
            `player${players[id].avatar}`,
            players[id].avatar
          );
        } else {
          this.player = new Player(
            this,
            players[id].x,
            players[id].y,
            `player${players[id].avatar}`,
            players[id].avatar
          );
          this.players[SocketManager.socket.id] = this.player;
        }
      });
    });

    SocketManager.onNewPlayer((player) => {
      this.players[player.id] = new Player(
        this,
        player.x,
        player.y,
        `player${player.avatar}`,
        player.avatar
      );
    });

    SocketManager.onPlayerMoved((player) => {
      console.log("onPlayerMoved");
      if (this.players[player.id]) {
        this.players[player.id].setPosition(player.x, player.y);
      }
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
