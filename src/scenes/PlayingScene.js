import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Claw from "../effects/Claw";
import { setBackground } from "../utils/backgroundManager";
import { io } from "socket.io-client";

export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.otherPlayers = {};
        this.clawCooldown = 1000;
        this.lastClawTime = 0;
    }

    create() {
        this.socket = io("http://143.248.177.132:3000");

        // 서버와 연결된 후 자신의 소켓 아이디를 출력
        this.socket.on("connect", () => {
            console.log("My socket ID:", this.socket.id);
        });

        this.socket.on("currentPlayers", (players) => {
            Object.keys(players).forEach((id) => {
                if (players[id].playerId !== this.socket.id) {
                    this.addOtherPlayers(players[id]);
                }
            });
        });

        this.socket.on("newPlayer", (playerInfo) => {
            this.addOtherPlayers(playerInfo);
        });

        this.socket.on("playerMoved", (playerInfo) => {
            if (this.otherPlayers[playerInfo.playerId]) {
                const otherPlayer = this.otherPlayers[playerInfo.playerId];

                // 이전 위치와 현재 위치를 비교하여 방향을 설정합니다.
                if (playerInfo.x > otherPlayer.x) {
                    otherPlayer.flipX = true;
                } else if (playerInfo.x < otherPlayer.x) {
                    otherPlayer.flipX = false;
                }

                if (
                    playerInfo.x > otherPlayer.x ||
                    playerInfo.x < otherPlayer.x ||
                    playerInfo.y > otherPlayer.y ||
                    playerInfo.y < otherPlayer.y
                ) {
                    if (!otherPlayer.m_moving) {
                        otherPlayer.play("player_anim");
                    }
                    otherPlayer.m_moving = true;
                } else {
                    if (otherPlayer.m_moving) {
                        otherPlayer.play("player_idle");
                    }
                    otherPlayer.m_moving = false;
                }

                // 이전 위치를 업데이트합니다.
                otherPlayer.previousX = otherPlayer.x;
                otherPlayer.previousY = otherPlayer.y;

                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });

        this.socket.on("attackPlayer", (clientId) => {
            if (this.otherPlayers[clientId]) {
                const otherPlayer = this.otherPlayers[clientId];

                this.createClawForPlayer(otherPlayer);
            }
        });

        this.socket.on("attackedPlayers", (attackedPlayerIds) => {
            attackedPlayerIds.forEach((playerId) => {
                if (this.otherPlayers[playerId]) {
                    const attackedPlayer = this.otherPlayers[playerId];
        
                    attackedPlayer.play("player_stun");
        
                    this.tweens.add({
                        targets: attackedPlayer,
                        alpha: 0,
                        yoyo: true,
                        repeat: 1,
                        duration: 70,
                        onComplete: () => {
                            attackedPlayer.setAlpha(1);
                            attackedPlayer.play("player_idle"); 
                            attackedPlayer.m_canMove = true;
                        },
                    });
                } else if (playerId === this.socket.id) {
                    this.m_player.m_canMove = false;
        
                    this.m_player.play("player_stun");
        
                    this.tweens.add({
                        targets: this.m_player,
                        alpha: 0,
                        yoyo: true,
                        repeat: 1,
                        duration: 70,
                        onComplete: () => {
                            this.m_player.setAlpha(1);
                            this.m_player.play("player_idle"); 
                            this.m_player.m_canMove = true;
                        },
                    });
                }
            });
        });
        



        this.socket.on("disconnected", (playerId) => {
            if (this.otherPlayers[playerId]) {
                this.otherPlayers[playerId].destroy();
                delete this.otherPlayers[playerId];
            }
        });

        // 사용할 sound들을 추가해놓는 부분입니다.
        // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
        // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_scratchSound = this.sound.add("audio_scratch");
        this.m_hitMobSound = this.sound.add("audio_hitMob");
        this.m_growlSound = this.sound.add("audio_growl");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_expUpSound = this.sound.add("audio_expUp");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_nextLevelSound = this.sound.add("audio_nextLevel");
        this.m_gameOverSound = this.sound.add("audio_gameOver");
        this.m_gameClearSound = this.sound.add("audio_gameClear");
        this.m_pauseInSound = this.sound.add("audio_pauseIn");
        this.m_pauseOutSound = this.sound.add("audio_pauseOut");

        setBackground(this, "background1");

        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_attackKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.Z
        );

        this.createPlayer();
    }

    update() {
        this.movePlayerManager();

        if (Phaser.Input.Keyboard.JustDown(this.m_attackKey)) {
            this.createClaw();
        }

        this.m_background.setX(this.m_player.x - Config.width / 2);
        this.m_background.setY(this.m_player.y - Config.height / 2);

        this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
        this.m_background.tilePositionY = this.m_player.y - Config.height / 2;
    }

    createClaw() {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastClawTime < this.clawCooldown) {
            return;
        }
        const offset = -40;
        const clawX = this.m_player.x + (this.m_player.flipX ? -offset : offset);
        const clawY = this.m_player.y;

        const claw = new Claw(this, [clawX, clawY], this.m_player.flipX, 10, 1);

        const vector = [this.m_player.flipX ? -1 : 1, 0];
        claw.move(vector);
        claw.setBodySize(28, 32);

        this.socket.emit("attackPosition", {
            x: clawX,
            y: clawY,
        });
        this.lastClawTime = currentTime;
    }

    createClawForPlayer(player) {
        const offset = -40;
        const clawX = player.x + (player.flipX ? -offset : offset);
        const clawY = player.y;

        const claw = new Claw(this, [clawX, clawY], player.flipX, 10, 1);

        const vector = [player.flipX ? -1 : 1, 0];
        claw.move(vector);
    }

    createPlayer() {
        const x = Math.floor(Math.random() * 700) + 50;
        const y = Math.floor(Math.random() * 500) + 50;
        this.m_player = new Player(this, x, y, "player");
        this.m_player.setDepth(30);
        this.m_player.play("player_idle");
        this.cameras.main.startFollow(this.m_player);

        this.socket.emit("joinRoom", {
            room: 0,
            x: this.m_player.x,
            y: this.m_player.y,
        });
    }

    movePlayerManager() {
        if (
            this.m_cursorKeys.left.isDown ||
            this.m_cursorKeys.right.isDown ||
            this.m_cursorKeys.up.isDown ||
            this.m_cursorKeys.down.isDown
        ) {
            if (!this.m_player.m_moving) {
                this.m_player.play("player_anim");
            }
            this.m_player.m_moving = true;
        } else {
            if (this.m_player.m_moving) {
                this.m_player.play("player_idle");
            }
            this.m_player.m_moving = false;
        }

        let vector = [0, 0];
        if (this.m_cursorKeys.left.isDown) {
            vector[0] += -1;
        } else if (this.m_cursorKeys.right.isDown) {
            vector[0] += 1;
        }

        if (this.m_cursorKeys.up.isDown) {
            vector[1] += -1;
        } else if (this.m_cursorKeys.down.isDown) {
            vector[1] += 1;
        }

        this.m_player.move(vector);
    }

    addOtherPlayers(playerInfo) {
        const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, "player");
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers[playerInfo.playerId] = otherPlayer;
        otherPlayer.play("player_idle");
    }
}
