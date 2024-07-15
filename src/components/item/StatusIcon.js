import Phaser from "phaser";
class StatusIcon extends Phaser.GameObjects.Image {
  constructor(scene, x, y, item) {
    let texture;
    switch (item) {
      case 0:
        texture = "speed";
        break;
      case 1:
        texture = "stealth";
        break;
      case 2:
        texture = "big";
        break;
      case 3:
        texture = "reverse";
        break;
      default:
        break;
    }
    super(scene, x, y, texture);
    this.setScale(5);
    this.setDepth(31); // 아이콘이 다른 오브젝트 위에 표시되도록 깊이 설정
    scene.add.existing(this);
  }
}

export default StatusIcon;
