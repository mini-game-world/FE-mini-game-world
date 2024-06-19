import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Claw from "../effects/Claw";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.otherPlayers = [];
  }

  create() {
    // SocketManager 인스턴스를 생성하고 씬을 전달
    this.socketManager = new SocketManager(this);

    this.m_scratchSound = this.sound.add("audio_scratch");

    // 배경 설정
    setBackground(this, "background1");

    // 입력 키 설정
    this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.m_attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );

    // 플레이어 생성
    this.createMyCharacter();
  }

  update() {
    this.movePlayerManager();
    this.updateGhost();

    if (
      Phaser.Input.Keyboard.JustDown(this.m_attackKey) &&
      this.m_player.m_isPlay
    ) {
      this.m_player.attack();
    }

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;

  }

  updateGhost() {
    if (!this.m_player.m_isPlay || this.m_player.m_isDead) {
      if (this.m_player.texture.key !== "playerDead") {
        this.m_player.setTexture("playerDead");
        this.m_player.play("player_dead");
        this.m_player.setAlpha(0.5); 
      }
    } else {
      if(this.m_player.texture.key === "playerDead"){
        this.m_player.setTexture("playerIdle1");
        this.m_player.play("player_idle");
        this.m_player.setAlpha(1);
      }
    }
    this.otherPlayers.forEach((id) => {
      if (!this.otherPlayers[id].m_isPlay || this.otherPlayers[id].m_isDead) {
        if (this.otherPlayer.texture.key !== "playerDead") {
          this.otherPlayers[id].setTexture("playerDead");
          this.otherPlayers[id].play("player_dead");
          this.m_player.setAlpha(0.5); 
        } 
      } else {
        if(this.otherPlayers[id].texture.key === "playerDead"){
          this.otherPlayers[id].setTexture("playerIdle1");
          this.otherPlayers[id].play("player_idle");
          this.m_player.setAlpha(1);
        }
      }
    });
  }

  createClaw() {
    const offset = -40;
    const clawX = this.m_player.x + (this.m_player.flipX ? -offset : offset);
    const clawY = this.m_player.y;

    const claw = new Claw(this, [clawX, clawY], this.m_player.flipX, 10, 1);

    const vector = [this.m_player.flipX ? -1 : 1, 0];
    claw.move(vector);
    claw.setBodySize(28, 32);

    // 서버에 공격 위치를 알림
    this.socketManager.attackPosition(clawX, clawY);
  }

  createClawForPlayer(player) {
    const offset = -40;
    const clawX = player.x + (player.flipX ? -offset : offset);
    const clawY = player.y;

    const claw = new Claw(this, [clawX, clawY], player.flipX, 10, 1);

    const vector = [player.flipX ? -1 : 1, 0];
    claw.move(vector);
  }

  createMyCharacter() {
    const x = Math.floor(Math.random() * 700) + 50;
    const y = Math.floor(Math.random() * 500) + 50;
    this.m_player = new Player(this, x, y, "player");

    this.m_player.setDepth(30);
    this.m_player.play("player_idle");
    this.cameras.main.startFollow(this.m_player);

    this.socketManager.joinRoom(this.m_player.x, this.m_player.y);

    this.m_player.on("animationcomplete-player_attack", this.createClaw, this);
  }

  bombPlayers(players) {
    this.m_player.m_hasBomb = false;
    this.m_player.hideBomb();
    Object.keys(this.otherPlayers).forEach((id) => {
      if (this.otherPlayers[id]) {
        this.otherPlayers[id].m_hasBomb = false;
        this.otherPlayers[id].hideBomb();
      }
    });

    players.forEach((playerId) => {
      if (playerId === this.socketManager.socketId) {
        this.m_player.m_hasBomb = true;
        this.m_player.showBomb();
      } else if (this.otherPlayers[playerId]) {
        this.otherPlayers[playerId].m_hasBomb = true;
        this.otherPlayers[playerId].showBomb();
      }
    });
  }

  movePlayerManager() {
    if (
      this.m_cursorKeys.left.isDown ||
      this.m_cursorKeys.right.isDown ||
      this.m_cursorKeys.up.isDown ||
      this.m_cursorKeys.down.isDown
    ) {
      if (!this.m_player.m_moving && !this.m_player.m_attacking) {
        this.m_player.play("player_anim");
      }
      this.m_player.m_moving = true;

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
    } else {
      if (this.m_player.m_moving && !this.m_player.m_attacking) {
        this.m_player.play("player_idle");
        // 플레이어가 멈출 때 한 번만 서버로 위치를 전송
        this.socketManager.playerMovement(this.m_player.x, this.m_player.y);
      }
      this.m_player.m_moving = false;
    }
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, "player");
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers[playerInfo.playerId] = otherPlayer;
    otherPlayer.play("player_idle");
  }

  updatePlayerPosition(otherPlayer, playerInfo) {
    // 이전 위치와 현재 위치를 비교하여 방향을 설정
    if (playerInfo.x > otherPlayer.x) {
      otherPlayer.flipX = true;
    } else if (playerInfo.x < otherPlayer.x) {
      otherPlayer.flipX = false;
    }

    // 이동 여부에 따라 애니메이션을 설정
    if (playerInfo.x !== otherPlayer.x || playerInfo.y !== otherPlayer.y) {
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

    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    // 폭탄 위치 업데이트
    if (otherPlayer.m_hasBomb) {
      otherPlayer.bombSprite.setPosition(playerInfo.x, playerInfo.y - 50);
    }
  }

  handleAttackedPlayers(attackedPlayerIds) {
    attackedPlayerIds.forEach((playerId) => {
      const attackedPlayer =
        playerId === this.socketManager.socket.id
          ? this.m_player
          : this.otherPlayers[playerId];

      if (attackedPlayer) {
        this.stunPlayer(attackedPlayer);
      }
    });
  }

  stunPlayer(player) {
    player.m_canMove = false;
    player.play("player_stun");

    this.tweens.add({
      targets: player,
      alpha: 0,
      yoyo: true,
      repeat: 1,
      duration: 70,
      onComplete: () => {
        player.setAlpha(1);
        player.play("player_idle");
        player.m_canMove = true;
      },
    });
  }

  playGame(arr) {
    if (arr[0] === 1) {
      console.log("게임 중");
      this.socketManager.bombplayerId.forEach((id) => {
        if (id === this.socketManager.socketId) {
          this.m_player.m_isPlay = true;
        } else if (this.otherPlayers[id]) {
          this.otherPlayers[id].m_isPlay = true;
        }
      });
    }
  }

  handleDeadPlayers(players) {
    players.forEach((id) => {
      if (id === this.socketManager.socketId) {
        this.m_player.m_isPlay = false;
        this.m_player.m_isDead = true;
        // this.m_player.setTexture("playerDead");
      } else if (this.otherPlayers[id]) {
        // this.otherPlayers[id].setTexture("playerDead");
        this.otherPlayers[id].m_isPlay = false;
        this.otherPlayers[id].m_isDead = true;
      }
    });
  }
}
