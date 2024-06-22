import io from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.socketId = null;
  }

  connect() {
    this.socket = io("http://143.248.177.142:3000");

    this.socket.on("connect", () => {
      this.socketId = this.socket.id;
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
}

export default new SocketManager();
