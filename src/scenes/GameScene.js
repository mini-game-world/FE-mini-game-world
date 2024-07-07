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
import BackgroundManager from "../utils/BackgroundManager";

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
        this.backgroundManager = null;
    }

    create() {
        SocketManager.connect();

        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.setBackground();

        this.bgmManager = new BGMManager(this);
        this.cameraManager = new CameraManager(this);

        this.resultText = new ResultText(this);
        this.playerCountText = new PlayerCountText(this);
        this.gameStatusText = new GameStatusText(this);

        this.mapShrinker = new MapShrinker(this);

        this.mapShrinker.reset();
        this.bgmManager.startWaitingBGM();

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
                        this.backgroundManager.backGround
                    );
                    this.physics.add.collider(
                        this.player.hitBox,
                        this.backgroundManager.house
                    );
                    this.physics.add.collider(
                        this.player.hitBox,
                        this.backgroundManager.object
                    );
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
            if (data && data.PunchingBag && data.PunchingBag.playerId != "") {
                this.time.delayedCall(
                    5000,
                    () => {
                        if (this.players[data.PunchingBag.playerId]) {
                            const bagPlayer =
                                this.players[data.PunchingBag.playerId];
                            bagPlayer.choice();
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

            let timer = 5000;
            if (data.PunchingBag.playerId != "") timer = 10000;
            if (data && data.BombMaster && data.BombMaster.playerId != "") {
                this.time.delayedCall(
                    timer,
                    () => {
                        if (this.players[data.BombMaster.playerId]) {
                            const bombMasterPlayer =
                                this.players[data.BombMaster.playerId];
                            bombMasterPlayer.choice();
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

