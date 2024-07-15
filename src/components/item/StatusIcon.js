import Phaser from "phaser";
class StatusIcon extends Phaser.GameObjects.Image {
  constructor(scene, x, y, item) {
    let texture;
    switch (item) {
      case 0:
        texture = "speedUp";
        break;
      case 1:
        texture = "badSight";
        break;
      case 2:
        texture = "speedDown";
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
