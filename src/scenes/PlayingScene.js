import Phaser from "phaser";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";
import Player from "../characters/Player";

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
    const player = new Player(this, playerInfo);
    this.players[playerInfo.id] = player;
  }

  updatePlayerPosition(playerInfo) {
    if (this.players[playerInfo.id]) {
      this.players[playerInfo.id].updatePosition(playerInfo.x, playerInfo.y);
    }
  }
}
