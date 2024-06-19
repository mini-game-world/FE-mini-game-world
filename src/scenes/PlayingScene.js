import Phaser from "phaser";
import Config from "../Config";
import Player from "../characters/Player";
import Claw from "../effects/Claw";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.otherPlayers = {};
  }

  create() {
    this.socketManager = new SocketManager(this);

    this.m_scratchSound = this.sound.add("audio_scratch");

    setBackground(this, "background1");

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.m_attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z
    );

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
      if (this.m_player.texture.key === "playerDead") {
        this.m_player.setTexture("playerIdle1");
        this.m_player.play("player_idle");
        this.m_player.setAlpha(1);
      }
    }

    Object.keys(this.otherPlayers).forEach((id) => {
      const otherPlayer = this.otherPlayers[id];
      if (!otherPlayer.m_isPlay || otherPlayer.m_isDead) {
        if (otherPlayer.texture.key !== "playerDead") {
          otherPlayer.setTexture("playerDead");
          otherPlayer.play("player_dead");
          otherPlayer.setAlpha(0.5); 
        }
      } else {
        if (otherPlayer.texture.key === "playerDead") {
          otherPlayer.setTexture("playerIdle1");
          otherPlayer.play("player_idle");
          otherPlayer.setAlpha(1);
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
    Object.values(this.otherPlayers).forEach((player) => {
      player.m_hasBomb = false;
      player.hideBomb();
    });

    players.forEach((playerId) => {
      if (playerId === this.socketManager.socketId) {
        this.m_player.m_hasBomb = true;
        this.m_player.showBomb();
        this.updateBombPosition(this.m_player);
      } else if (this.otherPlayers[playerId]) {
        this.otherPlayers[playerId].m_hasBomb = true;
        this.otherPlayers[playerId].showBomb();
        this.updateBombPosition(this.otherPlayers[playerId]);
      }
    });
  }

  updateBombPosition(player) {
    if (player.m_hasBomb) {
      if (!player.bombSprite) {
        player.bombSprite = this.add.sprite(player.x, player.y - 50, "bomb");
        player.bombSprite.setDepth(50); 
      } else {
        player.bombSprite.setPosition(player.x, player.y - 50);
      }
    } 
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

    if (playerInfo.x > otherPlayer.x) {
      otherPlayer.flipX = true;
    } else if (playerInfo.x < otherPlayer.x) {
      otherPlayer.flipX = false;
    }

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

  handlePlayers(players){
    players.forEach((id) => {
      if (id === this.socketManager.socketId) {
        this.m_player.m_isPlay = true;
      } else if (this.otherPlayers[id]) {
        this.otherPlayers[id].m_isPlay = true;
      }
    });
    this.updateGhost();
  }

  handleDeadPlayers(players) {
    players.forEach((id) => {
      if (id === this.socketManager.socketId) {
        this.m_player.m_isPlay = false;
        this.m_player.m_isDead = true;
      } else if (this.otherPlayers[id]) {
        this.otherPlayers[id].m_isPlay = false;
        this.otherPlayers[id].m_isDead = true;
      }
    });
  }
}
