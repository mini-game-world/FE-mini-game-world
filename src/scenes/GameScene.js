import Phaser from "phaser";
import Player from "../characters/Player";
import SocketManager from "../network/SocketManager";

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
        if (players[id].playerId === SocketManager.socketId)
          this.createMyPlayer(players[id]);
        else this.createOtherPlayers(players[id]);
      });
    });

    SocketManager.onNewPlayer((player) => {
      this.players[player.id] = new Player(this, player.x, player.y, "player");
    });
  }

  update() {
    if (this.player) {
      this.player.update();

      const { x, y } = this.player.sprite;
      // SocketManager.emitPlayerMove({ x, y });
    }
  }

  createMyPlayer(playerInfo) {
    this.player = new Player(this, playerInfo.x, playerInfo.y, "player");
  }

  createOtherPlayers(playerInfo) {
    const player = new Player(this, playerInfo.x, playerInfo.y, "player");
    this.players[playerInfo.id] = player;
  }
}

export default GameScene;
