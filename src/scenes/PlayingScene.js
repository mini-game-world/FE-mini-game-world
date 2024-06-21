import Phaser from "phaser";
import { setBackground } from "../utils/backgroundManager";
import SocketManager from "../network/socketManager";

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {
    this.socketManager = new SocketManager(this);

    setBackground(this, "background1");
  }

  update() {}
}
