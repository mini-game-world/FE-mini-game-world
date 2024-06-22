import Phaser from "phaser";

class Bomb {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "bomb");
    this.sprite.setCollideWorldBounds(true);
  }

  update() {
    // 폭탄의 업데이트 로직이 필요할 경우 작성
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }
}

export default Bomb;
