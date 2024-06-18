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
  }

    create() {
        this.socket = io("http://143.248.177.132:3000");

        // 서버와 연결된 후 자신의 소켓 아이디를 출력
        this.socket.on("connect", () => {
          console.log("My socket ID:", this.socket.id);
        });
    
        this.socket.on("currentPlayers", (players) => {
          Object.keys(players).forEach((id) => {
            if (players[id].playerId != this.socket.id) {
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
    
            // 이전 위치를 업데이트합니다.
            otherPlayer.previousX = otherPlayer.x;
            otherPlayer.previousY = otherPlayer.y;
    
            otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          }
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

        // player를 m_player라는 멤버 변수로 추가합니다.
        this.m_player = new Player(this);
        this.m_player.play('player_idle');

        this.cameras.main.startFollow(this.m_player);

        setBackground(this, "background1");

        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        this.movePlayerManager();

        if (Phaser.Input.Keyboard.JustDown(this.m_attackKey)) {
            this.createClaw();
            this.m_player.attack();
        }

        this.m_background.setX(this.m_player.x - Config.width / 2);
        this.m_background.setY(this.m_player.y - Config.height / 2);

        this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
        this.m_background.tilePositionY = this.m_player.y - Config.height / 2;
    }

    createClaw() {
        // 플레이어의 위치에서 일정 거리(offset)만큼 앞으로 이동시킨 위치에서 Claw를 생성합니다.
        const offset = -40; // 예시로 30 픽셀 앞으로 이동시킵니다.
        const clawX = this.m_player.x + (this.m_player.flipX ? -offset : offset);
        const clawY = this.m_player.y;

        // Claw를 생성합니다. 플레이어의 위치, 방향 등을 적절히 설정하여 생성합니다.
        const claw = new Claw(this, [clawX, clawY], this.m_player.flipX, 10, 1);
        
        // 플레이어의 움직임 벡터를 전달하여 Claw도 움직이도록 합니다.
        const vector = [this.m_player.flipX ? -1 : 1, 0]; // 플레이어의 방향에 따라 Claw의 방향 설정
        claw.move(vector);
    }
    

    createPlayer() {
        const x = Math.floor(Math.random() * 700) + 50;
        const y = Math.floor(Math.random() * 500) + 50;
        this.m_player = new Player(this, x, y, "player");
        this.cameras.main.startFollow(this.m_player);
    
        // 플레이어 정보를 서버로 전송
        this.socket.emit("joinRoom", { room: 0, x: this.m_player.x, y: this.m_player.y });
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
    
        // vector를 사용해 움직임을 관리할 것입니다.
        // vector = [x좌표 방향, y좌표 방향]입니다.
        // 왼쪽 키가 눌려있을 때는 vector[0] += -1, 오른쪽 키가 눌려있을 때는 vector[0] += 1을 해줍니다.
        // 위/아래 또한 같은 방법으로 벡터를 수정해줍니다.
        let vector = [0, 0];
        if (this.m_cursorKeys.left.isDown) {
          // player.x -= PLAYER_SPEED // 공개영상에서 진행했던 것
          vector[0] += -1;
        } else if (this.m_cursorKeys.right.isDown) {
          vector[0] += 1;
        }
    
        if (this.m_cursorKeys.up.isDown) {
          vector[1] += -1;
        } else if (this.m_cursorKeys.down.isDown) {
          vector[1] += 1;
        }
    
        if (vector[0] !== 0 || vector[1] !== 0) {
          this.m_player.move(vector);
          this.socket.emit("playerMovement", {
            x: this.m_player.x,
            y: this.m_player.y,
          });
        }
      }
    
      addOtherPlayers(playerInfo) {
        const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, "player");
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers[playerInfo.playerId] = otherPlayer;
      }
    }
    
