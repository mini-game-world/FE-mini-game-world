import geckos from "@geckos.io/client";

class SocketManager {
  constructor() {
    this.channel = null;
  }

  connect() {
    this.channel = geckos({
      url: "https://www.jungleptest.xyz",
      port: 443,
    });

    this.channel.onConnect((error) => {
      if (error) {
        console.error("Connection error:", error.message);
        return;
      }
      console.log("Connected to server");
      console.log(this.channel);
    });

    this.channel.onDisconnect(() => {
      console.log("Disconnected from server");
    });

    this.channel.on("error", (error) => {
      console.error("Channel error:", error);
    });

    this.channel.on("iceConnectionStateChange", (state) => {
      console.log("ICE Connection State Change:", state);
    });

    this.channel.on("connectionStateChange", (state) => {
      console.log("Connection State Change:", state);
    });
  }

  onCurrentPlayers(callback) {
    this.channel.on("currentPlayers", callback);
  }

  onNewPlayer(callback) {
    this.channel.on("newPlayer", callback);
  }

  onPlayerMoved(callback) {
    this.channel.on("playerMoved", callback);
  }

  onPlayerAttacked(callback) {
    this.channel.on("attackedPlayers", callback);
  }

  onAttackPlayer(callback) {
    this.channel.on("attackPlayer", callback);
  }

  onPlayerDisconnected(callback) {
    this.channel.on("playerDisconnected", callback);
  }

  onPlayingGame(callback) {
    this.channel.on("playingGame", callback);
  }

  onBombUsers(callback) {
    this.channel.on("bombUsers", callback);
  }

  onDeadUsers(callback) {
    this.channel.on("deadUsers", callback);
  }

  onChangeBombUser(callback) {
    this.channel.on("changeBombUser", callback);
  }

  onWinnerPlayer(callback) {
    this.channel.on("gameWinner", callback);
  }

  onBombGameReady(callback) {
    this.channel.on("bombGameReady", callback);
  }

  onGameStatus(callback) {
    this.channel.on("gamestatus", callback);
  }

  emitPlayerMovement(data) {
    this.channel.emit("playerMovement", data);
  }

  emitPlayerAttack(data) {
    this.channel.emit("attackPosition", data);
  }

  emitChatMessage(message) {
    this.channel.emit("message", message);
  }

  onChatMessage(callback) {
    this.channel.on("broadcastMessage", ({ playerId, message }) => {
      callback({ playerId, message });
    });
  }

  onNewItems(callback) {
    this.channel.on("newItems", callback);
  }

  onItemPickedUp(callback) {
    this.channel.on("itemPickedUp", callback);
  }

  emitJoinRoom(data) {
    this.channel.emit("joinRoom", data);
  }

  onLeavedRoom(callback) {
    this.channel.on("leavedRoom", callback);
  }
}

export default new SocketManager();
