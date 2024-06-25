import Phaser from "phaser";
import Player from "../components/Player";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import WinnerText from "../components/WinnerText";
import GameStatusText from "../components/GameStatusText";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.players = {};
    this.playerCountText = null;
  }

  create() {
    // this.add.image(400, 300, "background");

    // 타일맵 설정
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('first_tileset', 'tiles');

    // 타일 크기와 타일셋 이미지 크기 확인
    if (tileset.tileWidth !== 32 || tileset.tileHeight !== 32) {
      console.error("타일셋의 타일 크기가 32x32가 아닙니다.");
      return;
    }
    
    // 레이어 생성 (Tiled에서 설정한 레이어 이름 사용)
    const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
    const blocklayer = map.createLayer('block', tileset, 0, 0);
    // layer.setCollisionByProperty({ collides: true });
    blocklayer.setCollisionByProperty({ collides: true });

    this.playerCountText = new PlayerCountText(this, 16, 16, 0);

    this.gameStatusText = new GameStatusText(this);

    SocketManager.connect();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const info = { avatar, isPlay, isDead, nickname };
        if (id !== SocketManager.socket.id) {
          this.players[id] = new Player(this, x, y, `player${avatar}`, info);
        } else {
          this.player = new Player(this, x, y, `player${avatar}`, info);
          this.players[SocketManager.socket.id] = this.player;
          this.cameras.main.startFollow(this.player);
          this.cameras.main.setZoom(1);

          // 충돌 설정
          this.physics.add.collider(this.player, blocklayer);
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, isPlay, nickname } = player;
      const info = { avatar, isPlay, nickname };
      this.players[playerId] = new Player(this, x, y, `player${avatar}`, info);
      this.updatePlayerCountText();
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        if (this.players[playerId].isDead) {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play("dead", true);
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
        } else {
          const prevX = this.players[playerId].x;
          this.players[playerId].setPosition(x, y);
          this.players[playerId].anims.play(
            `move${this.players[playerId].avatar}`,
            true
          );
          this.players[playerId].setFlipX(prevX < x); // 방향 설정
          clearTimeout(this.players[playerId].idleTimeout);
          this.players[playerId].idleTimeout = setTimeout(() => {
            this.players[playerId].anims.play(
              `idle${this.players[playerId].avatar}`,
              true
            );
          }, 100);
        }
      }
    });

    SocketManager.onPlayerAttacked((ids) => {
      ids.forEach((id) => {
        this.players[id].stunPlayer();
      });
    });

    SocketManager.onAttackPlayer((id) => {
      this.players[id].createClawAttack(false);
    });

    SocketManager.onPlayerDisconnected((id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
        this.updatePlayerCountText();
      }
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying == 1) {
        this.gameStatusText.showText("게임시작");
        Object.values(this.players).forEach((player) => {
          player.setPlayStatus();
        });
      } else {
        this.gameStatusText.showText("게임종료");
        Object.values(this.players).forEach((player) => {
          player.setReadyStatus();
        });
      }
    });

    SocketManager.onBombUsers((players) => {
      players.forEach((id) => {
        this.players[id].setBombUser();
      });
    });

    SocketManager.onDeadUsers((players) => {
      players.forEach((id) => {
        this.players[id].setDeadStatus();
      });
    });

    SocketManager.onChangeBombUser((players) => {
      const current = players[0];
      const previous = players[1];
      this.players[current].setBombUser();
      this.players[previous].removeBomb();
    });

    SocketManager.onWinnerPlayer((id) => {
      this.WinnerText = new WinnerText(this);
      this.WinnerText.showWinner(this.players[id].name);
    });
  }

  updatePlayerCountText() {
    const playerCount = Object.keys(this.players).length;
    this.playerCountText.update(playerCount);
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
