// socketManager.js
import { io } from "socket.io-client";

class SocketManager {
  constructor(scene) {
    this.scene = scene;
    this.socket = io("http://143.248.177.117:3000");

    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    // 서버와 연결된 후 자신의 소켓 아이디를 출력
    this.socket.on("connect", () => {
      console.log("My socket ID:", this.socket.id);
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

    this.socket.on("bombUsers", (playerId) => {
      console.log(playerId);
      // 모든 플레이어의 폭탄 소유 여부 업데이트
      playerId.forEach((id) => {
        console.log(id);
        if (id === this.socket.id) {
          // 현재 클라이언트의 플레이어
          if (this.scene.m_player[id]) {
            this.scene.m_player.showBomb();
          } else {
            this.scene.m_player.hideBomb();
          }
        } else {
          // 다른 플레이어
          if (this.scene.otherPlayers[id]) {
            if (this.scene.otherPlayers[id]) {
              this.scene.otherPlayers[id].showBomb();
            } else {
              this.scene.otherPlayers[id].hideBomb();
            }
          }
        }
      });
    });

    // 플레이어가 게임을 나갔을 때 화면에서 제거
    this.socket.on("disconnected", (playerId) => {
      if (this.scene.otherPlayers[playerId]) {
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
