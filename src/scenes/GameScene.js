import Phaser from "phaser";
import { EventBus } from "../EventBus";
import SocketManager from "../utils/SocketManager";
import PlayerCountText from "../components/PlayerCountText";
import ResultText from "../components/ResultText";
import GameStatusText from "../components/GameStatusText";
import MapShrinker from "../utils/MapShrinker";
import BGMManager from "../utils/BGMManager";
import CameraManager from "../utils/CameraManager";
import PlayerContainer from "../components/PlayerContainer";
import Item from "../components/Item";
import CollisionChecker from "../utils/CollisionChecker";

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

        this.mapShrinker = new MapShrinker(
            this,
            15000, // delay
            1000, // interval
            1400, // min Width
            1400, // min Height
            3840, // initial Width
            2560, // initial Height
            32, // tile Width
            24 // tile Height
        );

        // EventBus 이벤트 설정
        EventBus.emit("current-scene-ready", this);

        SocketManager.onCurrentPlayers((players) => {
            Object.keys(players).forEach((id) => {
                const { x, y, avatar, isPlay, isDead, nickname } = players[id];
                const isSelfInitiated = id === SocketManager.channel.id;
                const info = {
                    avatar,
                    isPlay,
                    isDead,
                    nickname,
                    isSelfInitiated,
                };
                const playerContainer = new PlayerContainer(
                    this,
                    x,
                    y,
                    `player${avatar}`,
                    info
                );
                this.players[id] = playerContainer;

                if (isSelfInitiated) {
                    this.player = playerContainer;
                    this.cameraManager.smoothFollow(this.player);
                    this.physics.add.collider(
                        this.player.hitBox,
                        this.backGround
                    );
                    this.physics.add.collider(this.player.hitBox, this.house);
                    this.physics.add.collider(this.player.hitBox, this.object);
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
                this.players[data.gameWinner].choice();
                this.resultText.showWinner(winPlayer.player.nickname);
                this.cameraManager.smoothFollow(winPlayer);
            }

            if (data && data.PunchingBag && data.PunchingBag.playerId) {
                this.time.delayedCall(
                    5000,
                    () => {
                        if (this.players[data.PunchingBag.playerId]) {
                            const bagPlayer =
                                this.players[data.PunchingBag.playerId];
                            this.players[data.PunchingBag.playerId].choice();
                            this.resultText.showPunchingBag(
                                bagPlayer.player.nickname
                            );
                            this.cameraManager.smoothFollow(bagPlayer);
                        }
                    },
                    [],
                    this
                );
            }

            if (data && data.BombMaster && data.BombMaster.playerId) {
                this.time.delayedCall(
                    10000,
                    () => {
                        if (this.players[data.BombMaster.playerId]) {
                            const bombMasterPlayer =
                                this.players[data.BombMaster.playerId];
                            this.players[data.BombMaster.playerId].choice();
                            this.resultText.showBombMaster(
                                bombMasterPlayer.player.nickname
                            );
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
                const playerNickname = this.players[playerId].player.nickname;
                this.players[playerId].showChatMessage(message);

                EventBus.emit("chat message", {
                    nickname: playerNickname,
                    message,
                });
            }
        });

        SocketManager.onNewItems((items) => {
            items.forEach(({ x, y }) => {
                const newItem = new Item(this, x, y, "item");
                this.items.push(newItem);
            });
        });

        SocketManager.onItemPickedUp((arr) => {
            Item.destroyItem(this, arr.x, arr.y);
            Item.applyItemEffect(this, arr.playerId, arr.item);
        });
    }

    setBackground() {
        const map = this.make.tilemap({ key: "map" });
        const house_1 = map.addTilesetImage("house_1", "house_1");
        const logs = map.addTilesetImage("logs", "logs");
        const stump_2 = map.addTilesetImage("stump_2", "stump_2");
        const Tileset_1 = map.addTilesetImage("Tileset_1", "Tileset_1");
        const tree_1 = map.addTilesetImage("tree_1", "tree_1");
        const tree_2 = map.addTilesetImage("tree_2", "tree_2");
        const stone_1 = map.addTilesetImage("stone_1", "stone_1");
        const stone_3 = map.addTilesetImage("stone_3", "stone_3");

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

        this.mapShrink = map.createLayer("MapShrink", Tileset_1, 0, 0);
        this.mapShrink.setCollisionByProperty({ collides: true });

        this.debugGraphics = this.add.graphics();
        this.backGround.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.house.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.object.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });
        this.mapShrink.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 128),
            faceColor: new Phaser.Display.Color(0, 255, 0, 128),
        });

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
                        itemIcon.setPosition(
                            player.x + player.displayWidth / 2 + 40,
                            player.y - player.displayHeight / 2 - 10
                        );
                    }
                }
            }
        }
    }
}

export default GameScene;


