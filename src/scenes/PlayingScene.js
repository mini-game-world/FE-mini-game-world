import Phaser from "phaser";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.players = {};
  }

  create() {
    this.socketManager = new SocketManager(this);

    setBackground(this, "background1");
  }

  update() {}

  addPlayer(playerInfo) {
    const avatar = playerInfo.avatar; 
    const player = this.add.sprite(playerInfo.x, playerInfo.y, `playerIdle${avatar}`).setOrigin(0.5, 0.5);
    player.setScale(0.4);
    this.players[playerInfo.id] = player;
    player.play(`player${avatar}_Idle`);
  }

  updatePlayerPosition(playerInfo) {
    if (this.players[playerInfo.id]) {
      this.players[playerInfo.id].setPosition(playerInfo.x, playerInfo.y);
    }
  }
}

