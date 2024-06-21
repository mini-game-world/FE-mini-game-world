import Phaser from "phaser";
import Config from "../Config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x = Config.width / 2,
    y = Config.height / 2,
    texture = "player"
  ) {
    super(scene, x, y, texture);
  }
}
