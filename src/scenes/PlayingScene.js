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

    // // 충돌 감지 설정
    // this.physics.add.collider(
    //   this.m_player,
    //   this.otherPlayersGroup,
    //   this.handlePlayerCollision,
    //   null,
    //   this
    // );
  }

  update() {
    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.m_attackKey)) {
      this.m_player.attack();
    }

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;
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

    // 서버에 방에 접속했음을 알림
    this.socketManager.joinRoom(this.m_player.x, this.m_player.y);

    // 공격 애니메이션 완료 후에 createClaw 호출
    this.m_player.on("animationcomplete-player_attack", this.createClaw, this);
  }


  bombPlayers(players) {
    console.log("폭탄배열업데이뚜");
    console.log(players);
    // 현재 플레이어와 다른 모든 플레이어의 폭탄 소유 여부 초기화
    this.m_player.m_hasBomb = false;
    this.m_player.hideBomb();
    Object.keys(this.otherPlayers).forEach((id) => {
      if (this.otherPlayers[id]) {
        this.otherPlayers[id].m_hasBomb = false;
        this.otherPlayers[id].hideBomb();
      }
    });
  
    // 서버에서 받은 데이터로 폭탄 소유 여부 업데이트
    Object.keys(players).forEach((id) => {
        console.log(id);
        if (id === this.socketManager.socketId) {
          this.m_player.m_hasBomb = true;
          this.m_player.showBomb();
        } else if (this.otherPlayers[id]) {
          this.otherPlayers[id].m_hasBomb = true;
          this.otherPlayers[id].showBomb();
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

//   handlePlayerCollision(player1, player2) {
//     if (player1.hasBomb && !player2.hasBomb) {
//       player1.hasBomb = false;
//       player2.hasBomb = true;
//       player1.hideBomb();
//       player2.showBomb();
//     }
//   }
}
