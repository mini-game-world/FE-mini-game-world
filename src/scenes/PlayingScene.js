import Phaser from "phaser";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";
import Player from "../characters/Player";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.myPlayer = null;
    this.players = {};
  }

  create() {
    this.socketManager = new SocketManager(this);

    setBackground(this, "background1");

    // 카메라 설정
    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
  }

  update() {
    if (this.myPlayer){
    this.myPlayer.update();
    }
    Object.values(this.players).forEach(player => player.update())
  }

  createMyPlayer(playerInfo) { 
    this.myPlayer = new Player(this, playerInfo.playerId);
    this.myPlayer.setPosition(playerInfo.x, playerInfo.y);
  }

  createOtherPlayers(playerInfo) {
    const player = new Player(this, playerInfo);
    this.players[playerInfo.id] = player;
  }

  updatePlayerPosition(playerInfo) {
    if (this.players[playerInfo.id]) {
      const player = this.players[playerInfo.id]
      player.setPosition(playerInfo.x, playerInfo.y)
    }
  }
}
