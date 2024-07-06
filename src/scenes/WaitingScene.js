import Phaser from "phaser";
import Player from "../components/Player";
import PlayerContainer from "../components/PlayerContainer";
import SocketManager from "../utils/SocketManager";
import ChatBox from "../components/ChatBox";
import CameraManager from "../utils/CameraManager";

class WaitingScene extends Phaser.Scene {
  constructor() {
    super("WaitingScene");


    this.players = {};
    this.player = null;

    this.transitionKey = null;
    this.transitionText = null;

    this.cameraManager = null;

    this.ChatBox = null;
  }

  create() {
    SocketManager.connect();
    this.setBackground();

    this.cameraManager = new CameraManager(this);

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
          0
        );
        this.players[id] = playerContainer;

        if (isSelfInitiated) {
          this.player = playerContainer;
          this.cameraManager.smoothFollow(this.player);
          this.ChatBox = new ChatBox(this, this.player);

          this.physics.add.collider(this.player, this.tileLayer1);
          this.physics.add.collider(this.player, this.object1);
          this.physics.add.collider(this.player, this.object2);
          this.physics.add.collider(this.player, this.object3);
          this.physics.add.collider(this.player, this.object4);
        }
      });
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
    });
    
    SocketManager.onPlayerMoved((player) => {
      const { playerId, x, y } = player;
      if (this.players[playerId]) {
        const playerContainer = this.players[playerId];
        playerContainer.moveTo(x, y);
      }
      
    });

      SocketManager.onPlayerDisconnected((id) => {
        console.log(id);
        if (this.players[id]) {
          this.players[id].destroy();
          console.log("여기기기이이이이이이이이이");
          delete this.players[id];
        }
      });  

    // SocketManager.onPlayerDisconnected((id) => {
    //   if (this.players[id]) {
    //     this.players[id].destroy();
    //     delete this.players[id];
    //   }
    // });

    // SocketManager.onLeavedRoom((id) => {
    //   if (this.players[id]) {

    //   }
    // });

    SocketManager.onChatMessage(({ playerId, message }) => {
      if (this.players[playerId]) {
        this.players[playerId].chatBalloon.showChatMessage(message);
      }
    });

    SocketManager.emitJoinRoom(0, () => {
        this.transitionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.input.keyboard.on("keydown-F", this.handleTransition, this);
    });
  }

  handleTransitionCheck() {
    if (this.player) {
      const { x, y } = this.player;
      if (x >= 1472 && x <= 1728 && y >= 1248 && y <= 1344) {
        this.transitionText.setVisible(true);
        this.transitionText.setPosition(this.player.x - 50, this.player.y - 50); // 텍스트 위치 조정
      } else {
        this.transitionText.setVisible(false);
      }
    }
  }

  handleTransition() {
    if (this.player) {
      const { x, y } = this.player;
      if (x >= 1472 && x <= 1728 && y >= 1248 && y <= 1344) {
        SocketManager.emitJoinRoom(1, () => {
          this.scene.start("GameScene");
        }); // 서버에 룸 번호 변경 요청 후 씬 전환
      }
    }
  }

  setBackground() {
    const map2 = this.make.tilemap({ key: "map2" });
    const Tileset_2 = map2.addTilesetImage("Tileset_2", "Tileset_2");
    const bed = map2.addTilesetImage("bed", "bed");
    const book_1 = map2.addTilesetImage("book_1", "book_1");
    const book_2 = map2.addTilesetImage("book_2", "book_2");
    const candle = map2.addTilesetImage("candle", "candle");
    const cup = map2.addTilesetImage("cup", "cup");
    const cupboard_2 = map2.addTilesetImage("cupboard_2", "cupboard_2");
    const fireplace_2 = map2.addTilesetImage("fireplace_2", "fireplace_2");
    const knife = map2.addTilesetImage("knife", "knife");
    const picture = map2.addTilesetImage("picture", "picture");
    const plate = map2.addTilesetImage("plate", "plate");
    const shelf = map2.addTilesetImage("shelf", "shelf");
    const spoon = map2.addTilesetImage("spoon", "spoon");
    const stool = map2.addTilesetImage("stool", "stool");
    const table_1 = map2.addTilesetImage("table_1", "table_1");
    const logs = map2.addTilesetImage("logs", "logs");

    this.tileLayer1 = map2.createLayer("Tile Layer 1", Tileset_2, 0, 0);
    this.tileLayer1.setCollisionByProperty({ collides: true });
    this.object1 = map2.createLayer("Object1", [Tileset_2, bed, cupboard_2, picture, shelf, stool, fireplace_2], 0, 0);
    this.object1.setCollisionByProperty({ collides: true });
    this.object2 = map2.createLayer("Object2", [table_1, book_1], 0, 0);
    this.object2.setCollisionByProperty({ collides: true });
    this.object3 = map2.createLayer("Object3", [book_2, stool, plate], 0, 0);
    this.object3.setCollisionByProperty({ collides: true });
    this.object4 = map2.createLayer("Object4", [candle, cup, spoon, knife, logs], 0, 0);
    this.object4.setCollisionByProperty({ collides: true });

    // 충돌 디버그 그래픽 추가
    this.debugGraphics = this.add.graphics();
    this.tileLayer1.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.object1.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.object2.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.object3.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });
    this.object4.renderDebug(this.debugGraphics, {
      tileColor: null, // 충돌하지 않는 타일은 표시하지 않음
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128), // 충돌 타일은 반투명 빨간색으로 표시
      faceColor: new Phaser.Display.Color(0, 255, 0, 128), // 충돌하는 면은 반투명 녹색으로 표시
    });

    this.physics.world.setBounds(0, 0, 2240, 1600);
  }

  update() {
    if (this.player) {
        this.player.update();
    }
  }
}

export default WaitingScene;
