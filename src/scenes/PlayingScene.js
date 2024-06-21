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
  }

  update() {
    if (this.myPlayer){
    this.myPlayer.update();
    }
  }

  createMyPlayer(playerInfo) { 
    this.myPlayer = new Player(this, playerInfo.playerId);
  }

  createOtherPlayers(playerInfo) {
    const player = new Player(this, playerInfo);
    this.players[playerInfo.id] = player;
  }

}
