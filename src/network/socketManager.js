// socketManager.js
import { io } from "socket.io-client";

class SocketManager {
  constructor(scene) {
    this.scene = scene;
    this.socket = io("http://143.248.177.142:3000");
    this.socketId = null;
    this.bombplayerId = [];

    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    // 서버와 연결된 후 자신의 소켓 아이디를 출력
    this.socket.on("connect", () => {
      this.socketId = this.socket.id;
      console.log("My socket ID:", this.socketId);
    });

    // 현재 접속해 있는 플레이어들을 받아와서 화면에 추가
    this.socket.on("currentPlayers", (players) => {
      Object.keys(players).forEach((id) => {
        if (players[id].playerId !== this.socket.id) {
          this.scene.addOtherPlayers(players[id]);
        }
      });
    });

    // 새로운 플레이어가 접속했을 때 화면에 추가
    this.socket.on("newPlayer", (playerInfo) => {
      this.scene.addOtherPlayers(playerInfo);
    });

    // 다른 플레이어가 이동했을 때 위치를 업데이트
    this.socket.on("playerMoved", (playerInfo) => {
      if (this.scene.otherPlayers[playerInfo.playerId]) {
        const otherPlayer = this.scene.otherPlayers[playerInfo.playerId];
        this.scene.updatePlayerPosition(otherPlayer, playerInfo);
      }
    });

    // 다른 플레이어가 공격했을 때 클로 효과를 생성
    this.socket.on("attackPlayer", (playerId) => {
      if (this.scene.otherPlayers[playerId]) {
        const otherPlayer = this.scene.otherPlayers[playerId];
        this.scene.createClawForPlayer(otherPlayer);
      }
    });

    // 공격받은 플레이어들을 스턴 상태로 만듦
    this.socket.on("attackedPlayers", (attackedPlayerIds) => {
      this.scene.handleAttackedPlayers(attackedPlayerIds);
    });

    // 술래
    this.socket.on("bombUsers", (players) => {
      this.scene.bombPlayers(players);
    });

    // 죽은 플레이어
    this.socket.on("deadUsers", (players) => {
      console.log("얘 죽음", players);
      this.scene.handleDeadPlayers(players);
    });

    // 게임 참여 플레이어
    this.socket.on("startBombGame", (players) => {
      this.bombplayerId = players;
      this.scene.handlePlayers(players);
    });

    // 방 게임 상태
    this.socket.on("playingGame", (room_arr) => {
      console.log("방 게임 상태", room_arr);
      this.scene.playGame(room_arr);
    });

    this.socket.on("gameWinner", (playerId) => {
      console.log("최종 우승자", playerId);
      this.scene.nextWinnerScene(playerId);
    });

    // 플레이어가 게임을 나갔을 때 화면에서 제거
    this.socket.on("disconnected", (playerId) => {
      if (this.scene.otherPlayers[playerId]) {
        this.scene.otherPlayers[playerId].hideBomb();
        this.scene.otherPlayers[playerId].destroy();
        delete this.scene.otherPlayers[playerId];
      }
    });
  }

  joinRoom(x, y) {
    this.socket.emit("joinRoom", {
      room: 0,
      x,
      y,
    });
  }

  attackPosition(x, y) {
    this.socket.emit("attackPosition", {
      x,
      y,
    });
  }

  playerMovement(x, y) {
    this.socket.emit("playerMovement", {
      x,
      y,
    });
  }
}

export default SocketManager;
