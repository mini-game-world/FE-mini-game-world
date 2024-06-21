import { io } from "socket.io-client";

class SocketManager {
  constructor(scene) {
    this.scene = scene;
    this.socket = io("http://143.248.177.142:3000");
    this.socketId = null;

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
      console.log('현재 접속해있는 플레이어' ,players);
      Object.keys(players).forEach((index) => {
        if(players[index].playerId === this.socket.id) this.scene.createMyPlayer(players[index]);
        else this.scene.createOtherPlayers(players[index])
      });
    });

    // 새로운 플레이어가 접속했을 때 화면에 추가
    this.socket.on("newPlayer", (playerInfo) => {
      console.log('새 플레이어 접속',playerInfo);
      this.scene.createOtherPlayers(playerInfo);
    });

    // 플레이어의 이동 위치 갱신 
    this.socket.on("playerMoved", (playerInfo) => {
      console.log('이동 갱신',playerInfo);

      this.scene.updatePlayerPosition(playerInfo);
    });
  }
  sendPlayerMovement(playerInfo) {
    this.socket.emit('playerMovement', playerInfo)
  }
}

export default SocketManager;
