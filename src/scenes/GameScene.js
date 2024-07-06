import Phaser from "phaser";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import ResultText from "../components/ResultText";
import GameStatusText from "../components/GameStatusText";
import MapShrinker from "../utils/MapShrinker";
import BGMManager from "../utils/BGMManager";
import CameraManager from "../utils/CameraManager";
import ChatBox from "../components/ChatBox";
import PlayerContainer from "../components/PlayerContainer";
import Item from "../components/Item";
import CollisionChecker from "../utils/CollisionChecker";
import Player from "../components/Player";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.player = null;

    this.players = {};
    this.activePlayers = {};
    this.deadPlayers = {};
    this.waitingPlayers = {};
    this.activeEffects = {};

    this.items = [];

    this.resultText = null;
    this.playerCountText = null;
    this.gameStatusText = null;

    this.bgmManager = null;
    this.cameraManager = null;
    this.mapShrinker = null;

    this.ChatBox = null;
    this.collisionChecker = new CollisionChecker();
  }

  create() {
    SocketManager.connect();
    this.setBackground();

    this.bgmManager = new BGMManager(this);
    this.cameraManager = new CameraManager(this);

    this.resultText = new ResultText(this);
    this.playerCountText = new PlayerCountText(this);
    this.gameStatusText = new GameStatusText(this);

    // MapShrinker 인스턴스 생성 및 시작
    console.log("Creating MapShrinker instance");
    this.mapShrinker = new MapShrinker(
      this,
      15000, //delay
      1000, //interval
      1400, //min Width
      1400, //min Height
      3840, //initial Width
      2560, //initial Height
      32, //tile Width
      24 //tile Height
    );
    // this.mapShrinker.start();

    SocketManager.onCurrentPlayers((players) => {
      Object.keys(players).forEach((id) => {
        const { x, y, avatar, isPlay, isDead, nickname } = players[id];
        const isSelfInitiated = id === SocketManager.channel.id;
        const info = { avatar, isPlay, isDead, nickname, isSelfInitiated };
        const playerContainer = new PlayerContainer(
          this,
          x,
          y,
          `player${avatar}`,
          info,
          1
        );
        this.players[id] = playerContainer;

        if (isSelfInitiated) {
          this.player = playerContainer;
          this.cameraManager.smoothFollow(this.player);
          this.ChatBox = new ChatBox(this, this.player);
          // 충돌 설정
          this.physics.add.collider(this.player, this.backGround);
          this.physics.add.collider(this.player, this.house);
          this.physics.add.collider(this.player, this.object);

          //waitingRoom(임시테스트)
          // this.physics.add.collider(this.player, this.tileLayer1);
          // this.physics.add.collider(this.player, this.object1);
          // this.physics.add.collider(this.player, this.object2);
          // this.physics.add.collider(this.player, this.object3);
          // this.physics.add.collider(this.player, this.object4);

        }

        if (isPlay) {
          this.activePlayers[id] = playerContainer;
        } else if (isDead) {
          this.deadPlayers[id] = playerContainer;
        } else {
          this.waitingPlayers[id] = playerContainer;
        }
      });
      this.updatePlayerCountText();
    });

    SocketManager.onNewPlayer((player) => {
      const { playerId, x, y, avatar, nickname } = player;
      const isSelfInitiated = false;
      const info = { avatar, nickname, isSelfInitiated };
      const newPlayer = new PlayerContainer(
        this,
        x,
        y,
        `player${avatar}`,
        info
      );
      this.players[playerId] = newPlayer;
      this.waitingPlayers[playerId] = newPlayer;

      this.updatePlayerCountText();
    });

    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        const playerContainer = this.players[playerId];
        playerContainer.moveTo(x, y);
      }
      this.collisionChecker.checkCollisionAndMove(player);
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
      if (this.activePlayers[id]) {
        this.activePlayers[id].destroy();
        delete this.activePlayers[id];
      }
      if (this.deadPlayers[id]) {
        this.deadPlayers[id].destroy();
        delete this.deadPlayers[id];
      }
      if (this.waitingPlayers[id]) {
        this.waitingPlayers[id].destroy();
        delete this.waitingPlayers[id];
      }
      this.updatePlayerCountText();
    });

    SocketManager.onPlayingGame((isPlaying) => {
      if (isPlaying == 1) {
        this.bgmManager.startPlayingBGM();
        this.gameStatusText.showStart();
        Object.values(this.players).forEach((player) => {
          player.setPlay();
          this.activePlayers[player.id] = player;
          delete this.waitingPlayers[player.id];
        });
        this.mapShrinker.start();
      } else {
        Item.clearAllItems(this);
        this.bgmManager.startWaitingBGM();
        this.gameStatusText.showEnd();
        Object.values(this.players).forEach((player) => {
          player.setReady();
          this.waitingPlayers[player.id] = player;
          delete this.activePlayers[player.id];
        });
        this.cameraManager.smoothFollow(this.player);
        this.mapShrinker.reset();
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
          this.deadPlayers[id] = this.players[id];
          delete this.activePlayers[id];
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

    SocketManager.onWinnerPlayer((data) => {
      Item.clearEffects(this);
      this.gameStatusText.showResult();
      this.player.stopMove();

      if (data && data.gameWinner && this.players[data.gameWinner]) {
        const winPlayer = this.players[data.gameWinner];
        winPlayer.choice();
        this.resultText.showWinner(winPlayer.player.nickname);
        this.cameraManager.smoothFollow(winPlayer);
      }
      if (data && data.PunchingBag && data.PunchingBag.playerId != '') {
        this.time.delayedCall(
          5000,
          () => {
            if (this.players[data.PunchingBag.playerId]) {
              const bagPlayer = this.players[data.PunchingBag.playerId];
              bagPlayer.choice();
              this.resultText.showPunchingBag(bagPlayer.player.nickname);
              this.cameraManager.smoothFollow(bagPlayer);
            }
          },
          [],
          this
        );
      }

      let timer = 5000;
      if(data.PunchingBag.playerId != '') timer = 10000;
      if (data && data.BombMaster && data.BombMaster.playerId != '') {
        console.log(timer);
        this.time.delayedCall(
          timer,
          () => {
            if (this.players[data.BombMaster.playerId]) {
              const bombMasterPlayer = this.players[data.BombMaster.playerId];
              bombMasterPlayer.choice();
              this.resultText.showBombMaster(bombMasterPlayer.player.nickname);
              this.cameraManager.smoothFollow(bombMasterPlayer);
            }
          },
          [],
          this
        );
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
      if (status === 1) {
        this.gameStatusText.showProceeding();
      } else {
        this.gameStatusText.showWait();
      }
    });
    this.bgmManager.startWaitingBGM();

    SocketManager.onChatMessage(({ playerId, message }) => {
      if (this.players[playerId]) {
        this.players[playerId].showChatMessage(message);
      }
    });

    SocketManager.onNewItems((items) => {
      console.log(items);
      items.forEach(({ x, y }) => {
        const newItem = new Item(this, x, y, "item"); // 'itemTexture'는 preload된 아이템 이미지의 키입니다.
        this.items.push(newItem);
        console.log(this.items);
      });
    });

    SocketManager.onItemPickedUp((arr) => {
      console.log(arr.playerId, arr.item, arr.x, arr.y);
      Item.destroyItem(this, arr.x, arr.y);
      Item.applyItemEffect(this, arr.playerId, arr.item);
    });
  }

  setBackground() {
    // 타일맵 설정
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("first_tileset", "first_tileset");
    const house_1 = map.addTilesetImage("house_1", "house_1");
    const logs = map.addTilesetImage("logs", "logs");
    const stump_2 = map.addTilesetImage("stump_2", "stump_2");
    const Tileset_1 = map.addTilesetImage("Tileset_1", "Tileset_1");
    const tree_1 = map.addTilesetImage("tree_1", "tree_1");
    const tree_2 = map.addTilesetImage("tree_2", "tree_2");
    const stone_1 = map.addTilesetImage("stone_1", "stone_1");
    const stone_3 = map.addTilesetImage("stone_3", "stone_3");

    //waitingRoom(임시 테스트)
    // const map2 = this.make.tilemap({ key: "map2" });
    // const bed = map2.addTilesetImage("bed", "bed");
    // const book_1 = map2.addTilesetImage("book_1", "book_1");
    // const book_2 = map2.addTilesetImage("book_2", "book_2");
    // const candle = map2.addTilesetImage("candle", "candle");
    // const cup = map2.addTilesetImage("cup", "cup");
    // const cupboard_2 = map2.addTilesetImage("cupboard_2", "cupboard_2");
    // const fireplace_2 = map2.addTilesetImage("fireplace_2", "fireplace_2");
    // const knife = map2.addTilesetImage("knife", "knife");
    // const picture = map2.addTilesetImage("picture", "picture");
    // const plate = map2.addTilesetImage("plate", "plate");
    // const shelf = map2.addTilesetImage("shelf", "shelf");
    // const spoon = map2.addTilesetImage("spoon", "spoon");
    // const stool = map2.addTilesetImage("stool", "stool");
    // const table_1 = map2.addTilesetImage("table_1", "table_1");
    // const Tileset_2 = map2.addTilesetImage("Tileset_2", "Tileset_2");
    // const logs = map2.addTilesetImage("logs", "logs");


    // 레이어 생성 (Tiled에서 설정한 레이어 이름 사용)
    this.backGround = map.createLayer("BackGround", Tileset_1, 0, 0);
    this.backGround.setCollisionByProperty({ collides: true });
    this.house = map.createLayer("House", house_1, 0, 0);
    this.house.setCollisionByProperty({ collides: true });
    this.object = map.createLayer(
      "Object",
      [Tileset_1, logs, stump_2, tree_1, tree_2, stone_1, stone_3],
      0,
      0
    );
    this.object.setCollisionByProperty({ collides: true });

    //waitingRoom(임시테스트)
    // this.tileLayer1 = map2.createLayer("Tile Layer 1", Tileset_2, 0, 0);
    // this.tileLayer1.setCollisionByProperty({ collides: true });
    // this.object1 = map2.createLayer("Object1", [Tileset_2, bed, cupboard_2, picture, shelf, stool, fireplace_2], 0, 0);
    // this.object1.setCollisionByProperty({ collides: true });
    // this.object2 = map2.createLayer("Object2", [table_1, book_1], 0, 0);
    // this.object2.setCollisionByProperty({ collides: true });
    // this.object3 = map2.createLayer("Object3", [book_2, stool, plate], 0, 0);
    // this.object3.setCollisionByProperty({ collides: true });
    // this.object4 = map2.createLayer("Object4", [candle, cup, spoon, knife, logs], 0, 0);
    // this.object4.setCollisionByProperty({ collides: true });

    // this.mapShrink = map.createLayer("MapShrink", Tileset_1, 0, 0);
    // this.mapShrink.setCollisionByProperty({ collides: true });

    // 충돌 디버그 그래픽 추가
    this.debugGraphics = this.add.graphics();
    this.backGround.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.house.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.object.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.mapShrink.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });

    // Set world bounds
    this.physics.world.setBounds(0, 0, 3840, 2560);
  }

  updatePlayerCountText() {
    const playerCount = Object.keys(this.players).length;
    this.playerCountText.update(playerCount);
  }

  update() {
    if (this.player) {
      this.player.update();
    }
    for (const playerId in this.players) {
      const player = this.players[playerId];
      if (player.itemIcons) {
        for (const itemId in player.itemIcons) {
          const itemIcon = player.itemIcons[itemId];
          if (itemIcon) {
            itemIcon.setPosition(player.x + player.displayWidth / 2 + 40, player.y - player.displayHeight / 2 - 10);
          }
        }
      }
    }
  }  

}

export default GameScene;
