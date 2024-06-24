import Phaser from "phaser";
import Player from "../components/Player";
import Bomb from "../components/Bomb";
import Timer from "../components/Timer";
import SocketManager from "../utils/SocketManager";
import Claw from "../components/Claw";

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
      console.log(players);
      Object.keys(players).forEach((id) => {
      const {x, y, avatar, isPlay, isDead, nickname} = players[id];
      const info = {avatar, isPlay, isDead, nickname};
        if (id !== SocketManager.socket.id) {
          this.players[id] = new Player(
            this,
            x,
            y,
            `player${avatar}`,
            info
          );
        } else {
          this.player = new Player(
            this,
            x,
            y,
            `player${avatar}`,
            info
          );
          this.players[SocketManager.socket.id] = this.player;
          this.cameras.main.startFollow(this.player);
          this.cameras.main.setZoom(1);
        }
      });
    });

    SocketManager.onNewPlayer((player) => {
      const {playerId, x, y, avatar, isPlay, nickname} = player;
      const info = {avatar, isPlay, nickname};
      this.players[playerId] = new Player(
        this,
        x,
        y,
        `player${avatar}`,
        info
      );
    });

    SocketManager.onPlayerMoved((player) => {
      const {playerId, x, y} = player;
      if (this.players[playerId]) {
        console.log("onPlayerMoved",this.players[playerId].isDead)
        if (this.players[playerId].isDead) {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play('dead', true);
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
        } else {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play(`move${this.players[playerId].avatar}`, true);
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
          clearTimeout(this.players[playerId].idleTimeout);
          this.players[playerId].idleTimeout = setTimeout(() => {
            this.players[playerId].anims.play(`idle${this.players[playerId].avatar}`, true);
          }, 100);
        }
      }
    });

    SocketManager.onPlayerAttacked((attackedPlayerIds) => {
      if(attackedPlayerIds.length != 0){ // 이걸 굳이 우리가?
      attackedPlayerIds.forEach((playerId) => {
      this.players[playerId].stunPlayer();
      });
    }
    });

    SocketManager.onAttackPlayer((playerId) => {
      this.players[playerId].createClawAttack(false);
    });

    SocketManager.onPlayerDisconnected((id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
      }
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying == 1){
        console.log("게임시작");
      }else{
        console.log("게임종료");
      }
      Object.values(this.players).forEach((player) => {
          if (isPlaying == 1){
            player.setPlayStatus(1);
          }else{
            setTimeout(function() {
              player.setPlayStatus(0);
            }, 5000);
          }
        });
    });

    SocketManager.onBombUsers((players) => {
      players.forEach((playerId) => {
          this.players[playerId].setBombUser();
        });
    });

    SocketManager.onDeadUsers((players) => {
      players.forEach((playerId) => {
          this.players[playerId].setDeadUser();
        });
    });
    
    SocketManager.onChangeBombUser((players) => {
      this.players[players[0]].setBombUser();
      this.players[players[1]].removeBomb();
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
