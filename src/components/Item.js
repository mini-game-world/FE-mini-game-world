// src/components/Item.js
import Phaser from "phaser";

class Item extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.world.enable(this);
  }
}

export default Item;