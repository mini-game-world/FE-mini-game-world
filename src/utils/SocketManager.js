import io from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io("https://www.jungleptest.xyz");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  onCurrentPlayers(callback) {
    this.socket.on("currentPlayers", callback);
  }

  onNewPlayer(callback) {
    this.socket.on("newPlayer", callback);
  }

  onPlayerMoved(callback) {
    this.socket.on("playerMoved", callback);
  }

  onPlayerAttacked(callback) {
    this.socket.on("attackedPlayers", callback);
  }

  onAttackPlayer(callback) {
    this.socket.on("attackPlayer", callback);
  }

  onPlayerDisconnected(callback) {
    this.socket.on("playerDisconnected", callback);
  }

  onPlayingGame(callback) {
    this.socket.on("playingGame", callback);
  }

  onBombUsers(callback) {
    this.socket.on("bombUsers", callback);
  }

  emitPlayerMovement(data) {
    this.socket.emit("playerMovement", data);
  }

   emitPlayerAttack(data) {
    this.socket.emit("attackPosition",data);
   }
}

export default new SocketManager();
