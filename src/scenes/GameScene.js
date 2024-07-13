import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";
import ResultText from "../components/ResultText";
import GameStatusText from "../components/GameStatusText";
import MapShrinker from "../utils/MapShrinker";
import BGMManager from "../utils/BGMManager";
import CameraManager from "../utils/CameraManager";
import PlayerContainer from "../components/PlayerContainer";
import Item from "../components/Item";
import ItemEffect from "../components/ItemEffect";
import RankText from "../components/RankText";
import InfoText from "../components/InfoText";
import BackgroundManager from "../utils/BackgroundManager";
import "regenerator-runtime/runtime";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null; // 내 캐릭터
    this.players = {}; // 모든 접속자(플레이어)

    this.resultText = null;
    this.playerCountText = null;
    this.gameStatusText = null;
    this.rankText = null;

    this.cameraManager = null;
    this.mapShrinker = null;
    this.bgmManager = null;
    this.backgroundManager = null;

    this.itemsGroup = null;
  }

  create() {
    SocketManager.connect();
    this.backgroundManager = new BackgroundManager(this);
    this.cameraManager = new CameraManager(this);

    this.resultText = new ResultText(this);
    this.infoText = new InfoText(this);
    this.gameStatusText = new GameStatusText(this);
    this.bgmManager = new BGMManager(this);

    this.rankText = new RankText(this);

    this.mapShrinker = new MapShrinker(this);

    this.itemsGroup = this.physics.add.group();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const isSelfInitiated = id === SocketManager.channel.id;
        const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };

        // 이미 플레이어 객체가 존재하면 무시
        if (!this.players[id]) {
          const playerContainer = new PlayerContainer(
            this,
            x,
            y,
            `player${avatar}`,
            info
          );
          this.players[id] = playerContainer;

          if (!this.player && isSelfInitiated) {
            this.player = playerContainer;
            this.cameraManager.smoothFollow(this.player);
            this.physics.add.collider(this.player.hitBox, this.backGround);
            this.physics.add.collider(this.player.hitBox, this.fence);
            this.physics.add.collider(this.player.hitBox, this.house);
            this.physics.add.collider(this.player.hitBox, this.object);

            this.mapShrinker.applyPreviousShrinks();
          }
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, nickname } = player;
      const isSelfInitiated = false;
      const info = { avatar, nickname, isSelfInitiated };

      // 이미 플레이어 객체가 존재하면 무시
      if (!this.players[playerId]) {
        const newPlayer = new PlayerContainer(
          this,
          x,
          y,
          `player${avatar}`,
          info
        );
        this.players[playerId] = newPlayer;

        this.updatePlayerCountText();
      }
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        this.players[playerId].moveTo(x, y);
      }
    });

    SocketManager.onPlayerAttacked((ids) => {
      ids.forEach((id) => {
        if (this.players[id]) {
          this.players[id].stunPlayer();
        }
      });
    });

    SocketManager.onAttackPlayer((id) => {
      if (this.players[id]) {
        this.players[id].createClawAttack();
      }
    });

    SocketManager.onPlayerDisconnected((id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
      }
      this.updatePlayerCountText();
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying === 1) {
        if (this.bgmManager) {
          this.bgmManager.playPlayingRandomBGM();
        }
        this.gameStatusText.showStart();
        Object.values(this.players).forEach((player) => {
          player.setPlay();
        });
      } else {
        if (this.bgmManager) {
          this.bgmManager.playWaitingRandomBGM();
        }
        this.gameStatusText.showEnd();
        Object.values(this.players).forEach((player) => {
          player.setReady();
        });
        const randomX = Phaser.Math.Between(1280, 2080);
        const randomY = Phaser.Math.Between(960, 1280);
        this.player.hitBox.setPosition(randomX, randomY);
        SocketManager.emitPlayerMovement({ x: randomX, y: randomY });
        this.cameraManager.smoothFollow(this.player);
        this.mapShrinker.reset();
        this.rankText.clearText();
        this.itemsGroup.clear(true, true);
      }
      this.updatePlayerCountText();
    });

    SocketManager.onPlayInfo((survivorCount) => {
      if (this.player && this.player.player && this.player.player.isPlay) {
        this.updatePlayInfo(survivorCount);
      }
    });

    SocketManager.onBombUsers((players) => {
      players.forEach((id) => {
        if (this.players[id]) {
          this.players[id].setBombUser();
        }
      });
    });

    SocketManager.onDeadUsers((players) => {
      players.forEach((id) => {
        if (this.players[id]) {
          this.players[id].setDead();
          if (id === SocketManager.channel.id) {
            const randomX = Phaser.Math.Between(0, 320);
            const randomY = Phaser.Math.Between(0, 320);
            this.player.hitBox.setPosition(randomX, randomY);
            SocketManager.emitPlayerMovement({ x: randomX, y: randomY });
          }
        }
      });
    });

    SocketManager.onChangeBombUser((players) => {
      const current = players[0];
      const previous = players[1];
      if (this.players[current]) {
        this.players[current].receiveBomb();
      }
      if (this.players[previous]) {
        this.players[previous].removeBomb();
      }
    });

    SocketManager.onWinnerPlayer(async (data) => {
      this.gameStatusText.showResult();
      this.player.stopMove();

      if (this.players[data.gameWinner]) {
        this.players[data.gameWinner].setWinner();
      }
      if (this.players[data.PunchingBag]) {
        this.players[data.PunchingBag].setWinner();
      }
      if (this.players[data.BombMaster]) {
        this.players[data.BombMaster].setWinner();
      }

      let position = null;

      // Check if this player is the game winner (highest priority)
      if (this.player === this.players[data.gameWinner]) {
        position = { x: 1680, y: 1752 };
      }

      // Check if this player is PunchingBag (second priority)
      if (this.player === this.players[data.PunchingBag]) {
        if (!position) {
          position = { x: 1280, y: 1752 };
        }
      }

      // Check if this player is BombMaster (third priority)
      if (this.player === this.players[data.BombMaster]) {
        if (!position) {
          position = { x: 2080, y: 1752 };
        }
      }

      // Set position if it's determined
      if (position) {
        this.player.setPosition(position.x, position.y);
        SocketManager.emitPlayerMovement({ x: position.x, y: position.y });
      }

      try {
        // Sequentially follow each player role if they exist
        if (data.gameWinner && this.players[data.gameWinner]) {
          await this.cameraManager.smoothFollowWinner(
            this.players[data.gameWinner]
          );
          await this.players[data.gameWinner].choice(
            this.resultText.showWinner
          );
        }

        if (data.PunchingBag && this.players[data.PunchingBag]) {
          await this.cameraManager.smoothFollowWinner(
            this.players[data.PunchingBag]
          );
          await this.players[data.PunchingBag].choice(
            this.resultText.showPunchKing
          );
        }

        if (data.BombMaster && this.players[data.BombMaster]) {
          await this.cameraManager.smoothFollowWinner(
            this.players[data.BombMaster]
          );
          await this.players[data.BombMaster].choice(
            this.resultText.showBombMaster
          );
        }
      } catch (error) {
        console.error("Error during smooth follow sequence:", error);
      }
    });

    SocketManager.onBombGameReady((count) => {
      if (this.gameStatusText) {
        if (count === -1) {
          this.gameStatusText.showWait();
        } else {
          this.gameStatusText.showReadyCount(count);
        }
      }
    });

    // 게임 접속 시 현재 상태 확인
    SocketManager.onGameStatus((status) => {
      if (this.bgmManager) {
        this.bgmManager.playWaitingRandomBGM();
      }
      if (status === 1) {
        this.gameStatusText.showProceeding();
      } else {
        this.gameStatusText.showWait();
      }
    });

    SocketManager.onChatMessage(({ playerId, message }) => {
      if (this.players[playerId]) {
        this.players[playerId].showChatMessage(message);
        this.player.addMessage(this.players[playerId].player.nickname, message);
      }
    });

    SocketManager.onNewItems((items) => {
      items.forEach(({ x, y }) => {
        const newItem = Item.createItem(this, x, y, "item");
        this.itemsGroup.add(newItem); // Add new item to the group
      });
    });

    SocketManager.onItemPickedUp((data) => {
      const { playerId, item, x, y } = data;
      this.itemsGroup.getChildren().forEach((existingItem) => {
        if (existingItem.x === x && existingItem.y === y) {
          existingItem.destroy();
          this.itemsGroup.remove(existingItem, true, true);
        }
      });

      if (this.players[playerId]) {
        const itemEffect = new ItemEffect(this, this.players[playerId], item);
        itemEffect.applyEffect();
      }
    });

    SocketManager.onCurrentBombRanker((data) => {
      if (this.players[data.playerId] && this.players[data.playerId].player) {
        this.rankText.showBombRank(
          this.players[data.playerId].player.nickname,
          data.count
        );
      }
    });

    SocketManager.onCurrentHitRanker((data) => {
      if (this.players[data.playerId] && this.players[data.playerId].player) {
        this.rankText.showHitRank(
          this.players[data.playerId].player.nickname,
          data.count
        );
      }
    });
  }

  updatePlayerCountText() {
    if (this.player && this.player.player && !this.player.player.isPlay) {
      const playerCount = Object.keys(this.players).length;
      this.infoText.update(playerCount);
    }
  }

  updatePlayInfo(survivorCount) {
    if (this.player && this.player.player && this.player.player.isPlay) {
      this.infoText.updatePlayInfo(survivorCount);
    }
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}

export default GameScene;
