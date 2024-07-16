import Phaser from "phaser";

class Item extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(0.15);

    scene.add.existing(this);
  }

  static createItem(scene, x, y, texture) {
    return new Item(scene, x, y, texture);
  }
}

export default Item;
