import io from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io("http://143.248.177.142:3000");

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

  onPlayerDisconnected(callback) {
    this.socket.on("playerDisconnected", callback);
  }

  emitPlayerMovement(data) {
    this.socket.emit("playerMovement", data);
  }

   emitPlayerAttack(data) {
    this.socket.emit("attackPosition",data);
   }
}

export default new SocketManager();
