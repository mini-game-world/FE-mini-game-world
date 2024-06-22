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
        }
      });
    });

    SocketManager.onNewPlayer((player) => {
      const {playerId,x,y, avatar} = player;
      console.log(playerId,x,y, avatar);
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
        this.players[playerId].setPosition(x, y);
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
